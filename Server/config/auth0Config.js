import { auth } from 'express-oauth2-jwt-bearer';

// Ensure that these values match your Auth0 settings
const jwtCheck = auth({
    audience: 'http://localhost:8000', // The audience (your API)
    issuerBaseURL: 'https://dev-fljy7gnrs84002pu.us.auth0.com', // Your Auth0 issuer URL
    tokenSigningAlg: 'RS256', // Token signing algorithm
});

export default jwtCheck;
