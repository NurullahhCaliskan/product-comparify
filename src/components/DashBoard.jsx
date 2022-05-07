import { useCallback, useRef, useState } from "react";
import {
    ContextualSaveBar, Toast, TopBar, ActionList, Navigation, Page, Loading, Card, FormLayout, TextField, SkeletonPage, Layout,
    AppProvider,Frame,TextContainer,SkeletonDisplayText,SkeletonBodyText,Modal
} from "@shopify/polaris";
import {ArrowLeftMinor, ConversationMinor, HomeMajor, OrdersMajor} from '@shopify/polaris-icons';


export function DashBoard() {
    const defaultState = useRef({
        emailFieldValue: 'dharma@jadedpixel.com',
        nameFieldValue: 'Jaded Pixel',
    });
    const [nameFieldValue, setNameFieldValue] = useState(
        defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
        defaultState.current.emailFieldValue,
    );

    const skipToContentRef = useRef(null);
    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1}/>
    );

    const handleNameFieldChange = useCallback((value) => {
        setNameFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleEmailFieldChange = useCallback((value) => {
        setEmailFieldValue(value);
        value && setIsDirty(true);
    }, []);

    const [isDirty, setIsDirty] = useState(false);

    return (<Page title="Dashboard">
        <Layout>
            {skipToContentTarget}
            <Layout.AnnotatedSection
                title="Url Details"
                description="Url History"
            >
                <Card sectioned>
                    <FormLayout>
                        <TextField
                            label="Full name"
                            value={nameFieldValue}
                            onChange={handleNameFieldChange}
                            autoComplete="name"
                        />
                        <TextField
                            type="email"
                            label="Url"
                            value={emailFieldValue}
                            onChange={handleEmailFieldChange}
                            autoComplete="email"
                        />
                    </FormLayout>
                </Card>
            </Layout.AnnotatedSection>
        </Layout>
    </Page>)
}
