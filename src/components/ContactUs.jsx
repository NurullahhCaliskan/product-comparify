import { useCallback, useState } from 'react';
import { Button, Card, Form, Page, Select, TextField } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../App.jsx';
import { Loading } from '../helper/Loading.jsx';

export function ContactUs() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [loading, setLoading] = useState(true);

    const getUrlList = async () => {
        setLoading(true);
        const response = await fetch('/user-mail').then((res) => res.json());

        if (response?.selectedMail) {
            setEmailMessage(response.selectedMail);
        }
        setLoading(false);
    };

    const loadingPageMarkup = <Loading />;

    const [emailMessage, setEmailMessage] = useState(getUrlList);
    const [supportMessage, setSupportMessage] = useState('');

    const handleMessageChange = useCallback((value) => setSupportMessage(value), []);
    const handleEmailChange = useCallback((value) => setEmailMessage(value), []);

    const [selected, setSelected] = useState('product-alert');

    const handleSelectChange = useCallback((value) => setSelected(value), []);

    const options = [
        { label: 'Product Alert', value: 'product-alert' },
        { label: 'Product Compare', value: 'product-compare' },
        { label: 'General Search', value: 'general-search' },
        { label: 'Other', value: 'other' },
    ];

    const saveContactSupport = async () => {
        if (emailMessage && supportMessage) {
            const count = await fetch('/contact-support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: emailMessage,
                    topic: selected,
                    message: supportMessage,
                }),
            }).then((res) => res.json());
        }
    };
    return (
        <Page title="Contact Us">
            {loading ? (
                loadingPageMarkup
            ) : (
                <Card sectioned>
                    <Form>
                        <TextField label="E-mail Address" value={emailMessage} onChange={handleEmailChange} autoComplete="off" />
                        <br />
                        <Select label="Topic" options={options} onChange={handleSelectChange} value={selected} />
                        <br />
                        <TextField label="Message" value={supportMessage} onChange={handleMessageChange} multiline={4} autoComplete="off" />
                        <br />
                        <Button primary onClick={() => saveContactSupport()}>
                            Send
                        </Button>
                    </Form>
                </Card>
            )}
        </Page>
    );
}
