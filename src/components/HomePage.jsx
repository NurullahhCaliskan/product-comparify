import { useCallback, useRef, useState } from 'react';
import { Card, Frame, Icon, Layout, Loading, Navigation, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer, Button, Toast, TopBar } from '@shopify/polaris';
import { AddProductMajor, ConversationMinor, ExchangeMajor, LocationMajor, NotificationMajor, ProfileMinor, ReportMinor, SearchMinor } from '@shopify/polaris-icons';
import { AddStore } from './AddStore.jsx';
import { Email } from './Email.jsx';
import { Alarm } from './Alarm.jsx';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../App.jsx';
import { ContactUs } from './ContactUs.jsx';
import { Profile } from './Profile';
import { Dashboard } from './dashboard/Dashboard.jsx';
import { Compare } from './compare/Compare.jsx';
import { MobileHamburgerMajor } from '@shopify/polaris-icons';

export function HomePage() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const skipToContentRef = useRef(null);
    const [frameIndex, setFrameIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

    const toggleMobileNavigationActive = useCallback(() => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive), []);

    const handleFrameIndex = (value) => {
        setFrameIndex(value);
        setMobileNavigationActive(false);
    };

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
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading /> : null;

    const getPageList = (index) => {
        let pageList = [];

        pageList.push(<Profile />);
        pageList.push(<ContactUs />);
        pageList.push(<AddStore />);
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
        <Frame primary navigation={navigationMarkup} showMobileNavigation={mobileNavigationActive} onNavigationDismiss={toggleMobileNavigationActive} skipToContentTarget={skipToContentRef.current}>
            {loadingMarkup}

            <div className={'show-hamburger'}>
                <Button onClick={toggleMobileNavigationActive}>
                    <Icon source={MobileHamburgerMajor} />
                </Button>
            </div>
            {pageMarkup}
        </Frame>
    );
}
