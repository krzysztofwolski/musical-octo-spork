import useSWR, { mutate } from "swr";
import { Image, Money } from "./types.ts";

export interface CartData {
  id: string;
  token: string;
  totalPrice: {
    gross: {
      currency: string;
      amount: number;
    };
  };
  lines: {
    id: string;
    quantity: number;
    variant: {
      name: string;
      product: {
        name: string;
        thumbnail: Image;
      };
    };
    totalPrice: {
      gross: Money;
    };
  }[];
}

const CART_QUERY = `{
  id
  token
  totalPrice{
    gross{
      currency
      amount
    }
  }
  lines{
    id
    quantity
    variant{
      name
      product{
        name
        thumbnail {
          url
          alt
        }
      }
    }
    totalPrice{
      gross{
        currency
        amount
      }
    }
  }
}`;

// deno-lint-ignore no-explicit-any
async function saleorGraphql<T = any>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch("/api/graphqlGateway", {
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });
  return await res.json();
}

const CART_CREATE_MUTATION = `mutation { checkoutCreate(
      input: {
        channel: "default-channel"
        lines: []
        shippingAddress: { country: US }
        billingAddress: { country: US }
        validationRules: {
          shippingAddress: { checkRequiredFields: false }
          billingAddress: { checkRequiredFields: false, checkFieldsFormat: false }
        }
      }
    ) {  checkout ${CART_QUERY}  } }`;

async function cartFetcher(): Promise<CartData> {
  const id = localStorage.getItem("cartId");

  if (id === null) {
    const { checkoutCreate } = await saleorGraphql<
      { checkoutCreate: { checkout: CartData } }
    >(CART_CREATE_MUTATION);
    localStorage.setItem("cartId", checkoutCreate.checkout.token);
    return checkoutCreate.checkout;
  }

  const { checkout } = await saleorGraphql(
    `query($token: UUID!) { checkout(token: $token) ${CART_QUERY} }`,
    { token: id },
  );
  if (checkout === null) {
    // If there is a cart ID, but the returned cart is null, then the cart
    // was already part of a completed order. Clear the cart ID and get a new
    // one.
    localStorage.removeItem("cartId");
    return cartFetcher();
  }

  return checkout;
}

export function useCart() {
  return useSWR<CartData, Error>("cart", cartFetcher, {});
}

const ADD_TO_CART_QUERY =
  `mutation addToCart($token: UUID!, $lines: [CheckoutLineInput!]!){
      checkoutLinesAdd(
        token: $token
        lines: $lines
      ) {
        checkout ${CART_QUERY}
      }
    }`;

export async function addToCart(cartId: string, productId: string) {
  const mutation = saleorGraphql<{ cart: CartData }>(ADD_TO_CART_QUERY, {
    token: cartId,
    lines: [{ variantId: productId, quantity: 1 }],
  }).then(({ cart }) => cart);
  await mutate("cart", mutation);
}

const REMOVE_FROM_CART_MUTATION = `
  mutation removeFromCart($cartId: UUID!, $lineId: ID!) {
  checkoutLineDelete(token: $cartId, lineId: $lineId) {
    checkout ${CART_QUERY}
  }
}
`;

export async function removeFromCart(cartId: string, lineItemId: string) {
  const mutation = saleorGraphql<{ cart: CartData }>(
    REMOVE_FROM_CART_MUTATION,
    {
      cartId,
      lineId: lineItemId,
    },
  ).then(({ cart }) => cart);
  await mutate("cart", mutation);
}

export function formatCurrency(amount: Money) {
  const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount.currency,
  });
  return intl.format(amount.amount);
}
