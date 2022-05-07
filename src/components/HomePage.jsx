import { useCallback, useRef, useState } from "react";
import {
    ContextualSaveBar, Toast, TopBar, ActionList, Navigation, Page, Loading, Card, FormLayout, TextField, SkeletonPage, Layout,
    AppProvider, Frame, TextContainer, SkeletonDisplayText, SkeletonBodyText, Modal
} from "@shopify/polaris";
import { ArrowLeftMinor, ConversationMinor, HomeMajor, OrdersMajor, EmailMajor, ClockMinor } from '@shopify/polaris-icons';
import { DashBoard } from "./DashBoard.jsx";
import { Url } from "./Url.jsx";
import { Email } from "./Email.jsx";
import { Alarm } from "./Alarm.jsx";
import favicon from '../assets/favicon.png';


export function HomePage() {
    const defaultState = useRef({
        emailFieldValue: 'dharma@jadedpixel.com',
        nameFieldValue: 'Jaded Pixel',
    });
    const skipToContentRef = useRef(null);
    const [frameIndex, setFrameIndex] = useState(0)
    const [toastActive, setToastActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState(
        defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
        defaultState.current.emailFieldValue,
    );
    const [storeName, setStoreName] = useState(
        defaultState.current.nameFieldValue,
    );
    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');

    const handleSubjectChange = useCallback(
        (value) => setSupportSubject(value),
        [],
    );
    const handleMessageChange = useCallback(
        (value) => setSupportMessage(value),
        [],
    );
    const handleDiscard = useCallback(() => {
        setEmailFieldValue(defaultState.current.emailFieldValue);
        setNameFieldValue(defaultState.current.nameFieldValue);
        setIsDirty(false);
    }, []);
    const handleSave = useCallback(() => {
        defaultState.current.nameFieldValue = nameFieldValue;
        defaultState.current.emailFieldValue = emailFieldValue;

        setIsDirty(false);
        setToastActive(true);
        setStoreName(defaultState.current.nameFieldValue);
    }, [emailFieldValue, nameFieldValue]);


    const toggleToastActive = useCallback(
        () => setToastActive((toastActive) => !toastActive),
        [],
    );
    const toggleUserMenuActive = useCallback(
        () => setUserMenuActive((userMenuActive) => !userMenuActive),
        [],
    );
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive,
            ),
        [],
    );
    const toggleIsLoading = useCallback(
        () => setIsLoading((isLoading) => !isLoading),
        [],
    );

    const handleFrameIndex = (value) => setFrameIndex(value);

    const toggleModalActive = useCallback(
        () => setModalActive((modalActive) => !modalActive),
        [],
    );

    const toastMarkup = toastActive ? (
        <Toast onDismiss={toggleToastActive} content="Changes saved"/>
    ) : null;

    const userMenuActions = [
        {
            items: [{content: 'Community forums'}],
        },
    ];

    const contextualSaveBarMarkup = isDirty ? (
        <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
                onAction: handleSave,
            }}
            discardAction={{
                onAction: handleDiscard,
            }}
        />
    ) : null;

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={userMenuActions}
            name="Dharma"
            detail={storeName}
            initials="D"
            open={userMenuActive}
            onToggle={toggleUserMenuActive}
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            searchResultsVisible={false}
            searchField={false}
            searchResults={false}
            onSearchResultsDismiss={false}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

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
                    }
                ]}
                action={{
                    icon: ConversationMinor,
                    accessibilityLabel: 'Contact support',
                    onClick: toggleModalActive,
                }}
            />
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading/> : null;

    const actualPageMarkup = (

        frameIndex === 0 ?
            <DashBoard/> :
            frameIndex === 1 ? <Url/> : frameIndex === 2 ? <Email/> : <Alarm/>
    );

    const loadingPageMarkup = (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small"/>
                            <SkeletonBodyText lines={9}/>
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
                onAction: toggleModalActive,
            }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField
                        label="Subject"
                        value={supportSubject}
                        onChange={handleSubjectChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Message"
                        value={supportMessage}
                        onChange={handleMessageChange}
                        autoComplete="off"
                        multiline
                    />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const logo = {
        width: 224,
        topBarSource:
        favicon,
        contextualSaveBarSource:
            'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
        url: 'http://jadedpixel.com',
        accessibilityLabel: 'Jaded Pixel',
    };

    return (
        <div  >
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
                <Frame
                    logo={logo}
                    offset="60px"

                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={mobileNavigationActive}
                    onNavigationDismiss={toggleMobileNavigationActive}
                    skipToContentTarget={skipToContentRef.current}
                >
                    {contextualSaveBarMarkup}
                    {loadingMarkup}
                    {pageMarkup}
                    {toastMarkup}
                    {modalMarkup}
                </Frame>
            </AppProvider>
        </div>
    );
}
