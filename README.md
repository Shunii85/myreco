# Myreco

<p align="center">
  <img src="./public/coverImage.jpg" />
</p>

#

<br/>

## Summary

" Myreco " is, as the name suggests, a study record application. It is an application for users to record and manage the contents and time of their studies.

## Usage

1. プロジェクトをクローンします( https の場合 )。

   ```
   git clone https://github.com/Shunii85/myreco
   ```

2. Move to the project directory

   ```
   cd myreco
   ```

3. Set the required url and key for supabase as environment variables. For local development, create a '.env ' file in the project root directory and set the following environment variables.

   ```makefile
   VITE_SUPABASE_URL='url'
   VITE_SUPABASE_KEY='anon_key'
   ```

4. Install dependencies.

   ```bash
   npm install
   ```

5. Launch the application.
   ```bash
   npm run dev
   ```

## Specification

1. When you start the application, a form for entering your study record will appear.
2. Enter the content and time studied and click the "Register" button.
3. The entered study record will be added to the list.
4. Two buttons next to each study record allow deletion and editing.

## Technology

- react
- typescript
- jest
- react testing library
