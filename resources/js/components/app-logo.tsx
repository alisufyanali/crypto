import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  return (
    <div className="flex items-center">
      {/* Logo Container */}
      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <AppLogoIcon className="w-8 h-8 fill-current text-white dark:text-black" />
      </div>

      {/* Text */}
      <div className="ml-3 text-left">
        <span className="block text-sm font-semibold truncate">
          African Alliance Rwanda
        </span>
      </div>
    </div>
  );
}
