import { useCallback, useRef, useState } from "react";
import {
    ContextualSaveBar, Toast, TopBar, ActionList, Navigation, Page, Loading, Card, FormLayout, TextField, SkeletonPage, Layout,
    AppProvider, Frame, TextContainer, SkeletonDisplayText, SkeletonBodyText, Modal, Button, ResourceList, TextStyle, Avatar
} from "@shopify/polaris";
import { ArrowLeftMinor, ConversationMinor, HomeMajor, OrdersMajor, EmailMajor } from '@shopify/polaris-icons';
import { userLoggedInFetch } from "../App";
import { useAppBridge } from "@shopify/app-bridge-react";

export function Email() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [loadingUrl, setLoadingUrl] = useState(false);

    const getUrlList = async () => {
        setLoadingUrl(true)

        const response = await fetch("/user-mail").then((res) => res.json());

        setUrlList(response);

        console.log(response)

        if (response?.mail) {
            setEmailFieldValue(response.mail);
        }

        setLoadingUrl(false)
    }

    const defaultState = useRef({
        urlFieldValue: 'yourmail@gmail.com'
    });

    const [emailFieldValue, setEmailFieldValue] = useState(defaultState.current.urlFieldValue);

    const [urlList, setUrlList] = useState(getUrlList);

    const skipToContentRef = useRef(null);
    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1}/>
    );

    const handleUrlFieldChange = useCallback((value) => {
        setEmailFieldValue(value);
        value && setIsDirty(true);
    }, []);

    const [isDirty, setIsDirty] = useState(false);

    const upsertEmail = async () => {
        setLoadingUrl(true)
        const count = await fetch("/user-mail", {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: emailFieldValue})
        }).then((res) => res.json());

        console.log('here')
        await getUrlList();
    }

    return (<Page title="Email">
        <Layout>
            {skipToContentTarget}
            <Layout.AnnotatedSection
                title="Email Configurations"
                description="Please add your email for sending notify"
            >

                <Card sectioned>
                    <FormLayout>

                        <TextField
                            disabled={loadingUrl}
                            label="Email"
                            value={emailFieldValue}
                            onChange={handleUrlFieldChange}
                            placeholder={"www.shopify.com"}
                        />

                        <Button onClick={() => upsertEmail()}> Save</Button>
                    </FormLayout>
                </Card>
            </Layout.AnnotatedSection>
        </Layout>
    </Page>)

}
