import { StripeProvider } from '@stripe/stripe-react-native';

export function StripeWrapper({ children }) {
  return (
    <StripeProvider publishableKey="YOUR_STRIPE_PUBLISHABLE_KEY">
      {children}
    </StripeProvider>
  );
}
// TODO: configurer Stripe côté serveur
