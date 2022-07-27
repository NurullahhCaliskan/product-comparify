import { useCallback, useEffect, useState } from 'react';
import { Toast } from '@shopify/polaris';

export function Toastr() {
    const [toastContent, setToastContent] = useState({ data: 'deneme', error: false });
    const [activeToastr, setActiveToastr] = useState(true);

    const toggleActive2 = () => {
        console.log('deneme');
        setActiveToastr(false);
    };

    const toastMarkup = activeToastr ? <Toast content={toastContent.data} error={toastContent.error} onDismiss={toggleActive2} /> : null;

    return <div>{toastMarkup}</div>;
}
