'use client';

import Header from '@/components/partials/Header';
import Footer from '@/components/partials/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main
                id="main-content"
                className="flex-1 bg-background-alt"
                role="main"
                aria-label="Main content"
            >
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout; 