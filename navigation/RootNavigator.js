// navigation/RootNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer }         from '@react-navigation/native';
import AuthNavigator                   from './AuthNavigator';
import TabNavigator                    from './TabNavigator';
import { supabase }                    from '../services/supabase';

export default function RootNavigator() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_ev, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {session ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
