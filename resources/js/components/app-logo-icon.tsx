import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Lambang_Polda_Jatim.png" alt="Polda Jawa Timur Logo" {...props} />;
}
