import { useCallback, useRef, useState } from 'react';
import { Toast, TopBar, Navigation, Loading, Card, FormLayout, TextField, SkeletonPage, Layout, AppProvider, Frame, TextContainer, SkeletonDisplayText, SkeletonBodyText, Modal } from '@shopify/polaris';
import { ConversationMinor, HomeMajor, OrdersMajor, EmailMajor, ClockMinor } from '@shopify/polaris-icons';
import { DashBoard } from './DashBoard.jsx';
import { Url } from './Url.jsx';
import { Email } from './Email.jsx';
import { Alarm } from './Alarm.jsx';
import favicon from '../assets/favicon.png';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../App.jsx';

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

    const handleFrameIndex = (value) => setFrameIndex(value);

    const toggleModalActive = useCallback(() => setModalActive((modalActive) => !modalActive), []);

    const toastMarkup = toastActive ? <Toast onDismiss={toggleToastActive} content="Changes saved" /> : null;

    const userMenuActions = [
        {
            items: [{ content: 'Community forums' }],
        },
    ];

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
                separator
                title="Product Comparify"
                items={[
                    {
                        label: 'Dashboard',
                        icon: HomeMajor,
                        onClick: () => handleFrameIndex(0),
                    },
                    {
                        label: 'Url',
                        icon: OrdersMajor,
                        onClick: () => handleFrameIndex(1),
                    },
                    {
                        label: 'Email',
                        icon: EmailMajor,
                        onClick: () => handleFrameIndex(2),
                    },
                    {
                        label: 'Alarm',
                        icon: ClockMinor,
                        onClick: () => handleFrameIndex(3),
                    },
                ]}
                action={{
                    icon: ConversationMinor,
                    accessibilityLabel: 'Contact support',
                    onClick: toggleModalActive,
                }}
            />
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading /> : null;

    const actualPageMarkup = frameIndex === 0 ? <DashBoard /> : frameIndex === 1 ? <Url /> : frameIndex === 2 ? <Email /> : <Alarm />;

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

    const modalMarkup = (
        <Modal
            open={modalActive}
            onClose={toggleModalActive}
            title="Contact support"
            primaryAction={{
                content: 'Send',
                onAction: () => saveContactSupport(),
            }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField label="Subject" value={supportSubject} onChange={handleSubjectChange} autoComplete="off" />
                    <TextField label="Message" value={supportMessage} onChange={handleMessageChange} autoComplete="off" multiline />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const logo = {
        width: 224,
        topBarSource: favicon,
        accessibilityLabel: 'Product Comparify',
    };

    return (
        <div>
            <AppProvider
                i18n={{
                    Polaris: {
                        Avatar: {
                            label: 'Avatar',
                            labelWithInitials: 'Avatar with initials {initials}',
                        },
                        ContextualSaveBar: {
                            save: 'Save',
                            discard: 'Discard',
                        },
                        TextField: {
                            characterCount: '{count} characters',
                        },
                        TopBar: {
                            toggleMenuLabel: 'Toggle menu',
                        },
                        Modal: {
                            iFrameTitle: 'body markup',
                        },
                        Frame: {
                            skipToContent: 'Skip to content',
                            navigationLabel: 'Navigation',
                            Navigation: {
                                closeMobileNavigationLabel: 'Close navigation',
                            },
                        },
                    },
                }}
            >
                <Frame logo={logo} offset="60px" topBar={topBarMarkup} navigation={navigationMarkup} showMobileNavigation={mobileNavigationActive} onNavigationDismiss={toggleMobileNavigationActive} skipToContentTarget={skipToContentRef.current}>
                    {loadingMarkup}
                    {pageMarkup}
                    {toastMarkup}
                    {modalMarkup}
                </Frame>
            </AppProvider>
        </div>
    );
}
