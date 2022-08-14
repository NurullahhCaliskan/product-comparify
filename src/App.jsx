import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppProvider as PolarisProvider, Frame } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ServiceUnavailable } from './components/serviceUnavailable/ServiceUnavailable.jsx';
import './css/main.css';
import { Profile } from './components/Profile.jsx';
import { ContactUs } from './components/ContactUs.jsx';
import { AddStore } from './components/AddStore.jsx';
import { Alarm } from './components/Alarm.jsx';
import { Dashboard } from './components/dashboard/Dashboard.jsx';
import { Compare } from './components/compare/Compare.jsx';

export default function App() {
    return (
        <PolarisProvider i18n={translations}>
            <AppBridgeProvider
                config={{
                    apiKey: process.env.SHOPIFY_API_KEY,
                    host: new URL(location).searchParams.get('host'),
                    forceRedirect: true,
                }}
            >
                <Frame>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Profile />} />
                            <Route path="/contact-us" element={<ContactUs />} />
                            <Route path="/add-store" element={<AddStore />} />
                            <Route path="/set-alarm" element={<Alarm />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/compare" element={<Compare />} />
                            <Route path="expenses" element={<ServiceUnavailable />} />
                        </Routes>
                    </BrowserRouter>
                </Frame>
            </AppBridgeProvider>
        </PolarisProvider>
    );
}

export function userLoggedInFetch(app) {
    const fetchFunction = authenticatedFetch(app);

    return async (uri, options) => {
        const response = await fetchFunction(uri, options);
        console.log(response.status);
        if (response.status === 503) {
            const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-AddStore');

            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/expenses`);
            return null;
        }
        if (response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1') {
            const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-AddStore');

            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
            return null;
        }

        return response;
    };
}
