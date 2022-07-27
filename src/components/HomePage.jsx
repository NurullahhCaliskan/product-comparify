import { useCallback, useRef, useState } from 'react';
import { Card, Frame, Layout, Loading, Navigation, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer, Toast, TopBar } from '@shopify/polaris';
import { AddProductMajor, ConversationMinor, ExchangeMajor, NotificationMajor, ProfileMinor, ReportMinor, SearchMinor } from '@shopify/polaris-icons';
import { Url } from './Url.jsx';
import { Email } from './Email.jsx';
import { Alarm } from './Alarm.jsx';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../App.jsx';
import { ContactUs } from './ContactUs.jsx';
import { Profile } from './Profile';
import { Dashboard } from './dashboard/Dashboard.jsx';
import { Compare } from './compare/Compare.jsx';

export function HomePage() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const skipToContentRef = useRef(null);
    const [frameIndex, setFrameIndex] = useState(0);
    const [toastActive, setToastActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);

    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');

    const handleSubjectChange = useCallback((value) => setSupportSubject(value), []);
    const handleMessageChange = useCallback((value) => setSupportMessage(value), []);

    const toggleToastActive = useCallback(() => setToastActive((toastActive) => !toastActive), []);
    const toggleUserMenuActive = useCallback(() => setUserMenuActive((userMenuActive) => !userMenuActive), []);
    const toggleMobileNavigationActive = useCallback(() => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive), []);
    const toggleIsLoading = useCallback(() => setIsLoading((isLoading) => !isLoading), []);

    const handleFrameIndex = (value) => {
        setFrameIndex(value);
    };

    const toggleModalActive = useCallback(() => setModalActive((modalActive) => !modalActive), []);

    const toastMarkup = toastActive ? <Toast onDismiss={toggleToastActive} content="Changes saved" /> : null;

    const saveContactSupport = async () => {
        if (supportSubject && supportMessage) {
            const count = await fetch('/contact-support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: supportSubject,
                    message: supportMessage,
                }),
            }).then((res) => res.json());

            setToastActive(true);
        }

        setModalActive(!modalActive);
    };

    const topBarMarkup = <TopBar showNavigationToggle searchResultsVisible={false} searchField={false} searchResults={false} onSearchResultsDismiss={false} onNavigationToggle={toggleMobileNavigationActive} />;

    const navigationMarkup = (
        <Navigation location="/">
            <Navigation.Section
                title="Product Comparify"
                items={[
                    {
                        onClick: () => handleFrameIndex(0),
                        label: 'Profile',
                        icon: ProfileMinor,
                    },
                    {
                        onClick: () => handleFrameIndex(1),
                        label: 'Contact Us',
                        icon: ConversationMinor,
                    },
                    {
                        onClick: () => handleFrameIndex(2),
                        label: 'Add Store',
                        icon: AddProductMajor,
                    },
                ]}
            />
            <Navigation.Section
                title="Product Alert"
                items={[
                    {
                        onClick: () => handleFrameIndex(5),
                        label: 'Dashboard',
                        icon: ReportMinor,
                    },
                    {
                        onClick: () => handleFrameIndex(4),
                        label: 'Set Alarm',
                        icon: NotificationMajor,
                    },
                ]}
                separator
            />
            <Navigation.Section
                title="Product Compare"
                items={[
                    {
                        onClick: () => handleFrameIndex(6),
                        label: 'Compare',
                        icon: ExchangeMajor,
                    },
                ]}
                separator
            />
            <Navigation.Section
                title="General Search"
                items={[
                    {
                        onClick: () => handleFrameIndex(0),
                        label: 'General Keyword',
                        icon: SearchMinor,
                    },
                ]}
                separator
            />
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading /> : null;

    const getPageList = (index) => {
        let pageList = [];

        pageList.push(<Profile />);
        pageList.push(<ContactUs />);
        pageList.push(<Url />);
        pageList.push(<Email />);
        pageList.push(<Alarm />);
        pageList.push(<Dashboard />);
        pageList.push(<Compare />);

        return pageList[index];
    };

    const actualPageMarkup = getPageList(frameIndex);

    const loadingPageMarkup = (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={9} />
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

    return (
        <Frame navigation={navigationMarkup} showMobileNavigation={mobileNavigationActive} onNavigationDismiss={toggleMobileNavigationActive} skipToContentTarget={skipToContentRef.current}>
            {loadingMarkup}

            {pageMarkup}
        </Frame>
    );
}
