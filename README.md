# Deno Merch, Saleor remix

Fork of the [Deno Merch shop](https://merch.deno.com/) with the
[Saleor API](https://saleor.cloud/).

## Screen Shot

![Screen Shot](./static/screen_shot.png)

## Develop locally

- Clone the repository
- Start the project in local mode:
  ```bash
  deno task start
  ```

If you want to use different Saleor instance, modify `SALEOR_API` in the `.env`,
follows `.env.example`.

## Deploy to global

Sign in to [dash.deno.com](https://dash.deno.com), create a new project, and
then link to your clone version of the repository.
