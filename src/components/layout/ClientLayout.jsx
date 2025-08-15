'use client';

import { usePathname } from 'next/navigation';
import MainLayout from './MainLayout';
import DynamicFavicon from '@/components/ui/DynamicFavicon';

const ClientLayout = ({ children }) => {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth');

    return (
        <>
            <DynamicFavicon />
            {isAuthPage ? children : <MainLayout>{children}</MainLayout>}
        </>
    );
};

export default ClientLayout; 