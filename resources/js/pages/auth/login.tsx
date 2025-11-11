import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to access your dashboard."
    >
      <Head title="Log in" />

      <Form
        {...AuthenticatedSessionController.store.form()}
        resetOnSuccess={['password']}
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  placeholder="email@example.com"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.email} />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  {canResetPassword && (
                    <TextLink
                      href={request()}
                      className="ml-auto text-sm text-primary dark:text-emerald-400"
                      tabIndex={5}
                    >
                      Forgot password?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  tabIndex={2}
                  autoComplete="current-password"
                  placeholder="Password"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
                <InputError message={errors.password} />
              </div>

              {/* Remember me */}
              <div className="flex items-center space-x-3">
                <Checkbox id="remember" name="remember" tabIndex={3} />
                <Label htmlFor="remember" className="text-gray-700 dark:text-gray-300">
                  Remember me
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="mt-4 w-full"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
              >
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Log in
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <TextLink href={register()} tabIndex={5} className="text-primary dark:text-emerald-400">
                Sign up
              </TextLink>
            </div>
          </>
        )}
      </Form>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-emerald-400">
          {status}
        </div>
      )}
    </AuthLayout>
  );
}
