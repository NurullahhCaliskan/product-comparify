import { Button, Card, FormLayout, Icon, Layout, Page, ResourceItem, ResourceList, TextField, TextStyle, Toast } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useCallback, useState } from 'react';
import { userLoggedInFetch } from '../App.jsx';
import { LocationMajor, ProfileMinor, StoreMajor } from '@shopify/polaris-icons';
import { Loading } from '../helper/Loading.jsx';

export function Profile() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);

    //toast
    const [activeToast, setActiveToast] = useState(false);
    const [toastContent, setToastContent] = useState({ data: '', error: false });
    const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);
    const toastMarkup = activeToast ? <Toast content={toastContent.data} error={toastContent.error} onDismiss={toggleActive} /> : null;

    const getUrlList = async () => {
        setLoading(true);
        const response = await fetch('/profile-info').then((res) => res.json());

        if (response?.selectedMail) {
            setEmailMessage(response.selectedMail);
        }

        setResultStoreId(response.storeId);
        setResultCountry(response.country_name);
        setResultCity(response.address1);
        setResultFirstName(response.first_name);
        setResultSurname(response.last_name);

        setLoading(false);
        setLoadingPage(false);
    };

    const upsertEmail = async () => {
        setSendLoading(true);
        try {
            const response = await fetch('/user-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailMessage }),
            });

            const jsonValue = await response.json();

            setToastContent({ data: jsonValue.data, error: !response.ok });
            setActiveToast(true);
        } catch (e) {
            console.log(e);
            setToastContent('error');
            setActiveToast(true);
        }
        setSendLoading(false);
        await getUrlList();
    };

    const [emailMessage, setEmailMessage] = useState(getUrlList);
    const [resultStoreId, setResultStoreId] = useState('');
    const [resultCity, setResultCity] = useState('');
    const [resultCountry, setResultCountry] = useState('');
    const [resultFirstName, setResultFirstName] = useState('');
    const [resultSurname, setResultSurname] = useState('');

    const handleEmailChange = useCallback((value) => setEmailMessage(value), []);
    return (
        <Page fullWidth title="Profile">
            {toastMarkup}

            {loadingPage ? (
                <Loading />
            ) : (
                <div>
                    <Layout>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[
                                        {
                                            id: 1,
                                        },
                                    ]}
                                    renderItem={(item) => {
                                        const { id } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" size="large" source={StoreMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong">Store Id</TextStyle>
                                                </h3>
                                                <div>{resultStoreId}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[
                                        {
                                            id: 145,
                                        },
                                    ]}
                                    renderItem={(item) => {
                                        const { id } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" name={resultSurname + ', ' + resultFirstName} source={ProfileMinor} />}>
                                                <h3>
                                                    <TextStyle variation="strong">Last, First Name</TextStyle>
                                                </h3>
                                                <div>{resultSurname + ', ' + resultFirstName}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                    </Layout>

                    <br />
                    <br />
                    <Layout>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[
                                        {
                                            id: 145,
                                        },
                                    ]}
                                    renderItem={(item) => {
                                        const { id } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" size="large" source={LocationMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong">Country</TextStyle>
                                                </h3>
                                                <div>{resultCountry}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneThird>
                            <Card>
                                <ResourceList
                                    resourceName={{ singular: 'customer', plural: 'customers' }}
                                    items={[
                                        {
                                            id: 145,
                                        },
                                    ]}
                                    renderItem={(item) => {
                                        const { id } = item;
                                        return (
                                            <ResourceItem verticalAlignment="center" id={id} media={<Icon color="primary" backdrop source={LocationMajor} />}>
                                                <h3>
                                                    <TextStyle variation="strong">City</TextStyle>
                                                </h3>
                                                <div>{resultCity}</div>
                                            </ResourceItem>
                                        );
                                    }}
                                />
                            </Card>
                        </Layout.Section>
                    </Layout>

                    <br />
                    <br />

                    <Card sectioned title="E-mail Address">
                        <FormLayout>
                            <FormLayout.Group>
                                <TextField value={emailMessage} onChange={handleEmailChange} autoComplete="off" />

                                <Button onClick={() => upsertEmail()} loading={sendLoading}>
                                    Save
                                </Button>
                            </FormLayout.Group>
                        </FormLayout>
                    </Card>
                </div>
            )}
        </Page>
    );
}
