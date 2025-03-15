# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## API Testing with Postman

1. Import both files from the `postman` directory:
   - `EzWorks_API_Tests.postman_collection.json` (Test Collection)
   - `EzWorks.postman_environment.json` (Environment Variables)
2. Select the "EzWorks Environment" from the environment dropdown
3. The collection includes tests for:
   - Valid email submission
   - Invalid email format
   - Restricted domain (@ez.works)
   - Empty email submission
   - 404 Not Found handling
4. Run the collection to execute all tests
5. View test results in the Postman Test Results tab

If you encounter 404 errors:
- Verify the API endpoint is correct in the environment variables
- Check if the API server is running
- Ensure network connectivity to the API server

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
