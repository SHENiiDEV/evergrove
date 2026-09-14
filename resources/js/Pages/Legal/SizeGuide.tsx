import SizeGuideModal from '@/Components/store/pdp/SizeGuideModal';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function SizeGuidePage() {
    return (
        <StoreLayout>
            <Head title="Size Guide - EverGrove" />
            <div className="u-container max-w-4xl py-12 lg:py-20">
                <SizeGuideModal open={true} onClose={() => window.history.back()} defaultGender="men" />
            </div>
        </StoreLayout>
    );
}
