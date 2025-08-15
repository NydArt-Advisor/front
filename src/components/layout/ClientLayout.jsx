'use client';

import { usePathname } from 'next/navigation';
import MainLayout from './MainLayout';

const ClientLayout = ({ children }) => {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth');

    if (isAuthPage) {
        return children;
    }

    return <MainLayout>{children}</MainLayout>;
};

export default ClientLayout; 