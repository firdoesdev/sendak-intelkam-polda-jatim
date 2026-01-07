import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            
            </div> */}
             <div className="flex aspect-square size-8 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className="size-auto fill-current text-white dark:text-black" />
            
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Sistem Informasi Permohonan dan Pengelolaan Izin Senjata Api dan Peledak
                </span>
                <span className="text-xs text-muted-foreground truncate leading-tight">
                    Sendak Intelkam Polda Jatim
                </span>
            </div>
        </>
    );
}
