import { Redirect } from 'expo-router';
import * as React from 'react';

export default function LoginRedirect() {
  return <Redirect href="/role-select" />;
}
