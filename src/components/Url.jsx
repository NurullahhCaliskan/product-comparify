import { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Card, EmptySearchResult, EmptyState, Page, Pagination, ResourceList, Stack, TextField, TextStyle, Toast, Badge } from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { userLoggedInFetch } from '../App';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Loading } from '../helper/Loading.jsx';
import addStore from '../assets/addstore.svg';

export function Url() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [showedAddStoreCoverCounter, setShowedAddStoreCoverCounter] = useState(0);
    const [sendLoading, setSendLoading] = useState(false);
    const [activeToast, setActiveToast] = useState(false);
    const [toastContent, setToastContent] = useState({ data: '', error: false });

    const [pageIndex, setPageIndex] = useState(0);
    const [minPageIndex, setMinPageIndex] = useState(true);
    const [maxPageIndex, setMaxPageIndex] = useState(true);

    const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);

    const toastMarkup = activeToast ? <Toast content={toastContent.data} error={toastContent.error} onDismiss={toggleActive} /> : null;

    const [loadingUrl, setLoadingUrl] = useState(true);
    const [showUrls, setShowUrls] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const getUrlList = async () => {
        const response = await fetch('/user-crawl-url').then((res) => res.json());

        setUrlList(response);

        console.log(showedAddStoreCoverCounter);

        if (response.length === 0) {
            if (showedAddStoreCoverCounter === 0) {
                setShowedAddStoreCoverCounter(showedAddStoreCoverCounter + 1);
                setShowUrls(false);
            }
        }
        setLoadingUrl(false);

        setSelectedItems([]);
        setUrlFieldValue('www.shopify.com');
    };

    const [urlFieldValue, setUrlFieldValue] = useState('www.shopify.com');

    const [urlList, setUrlList] = useState(getUrlList);

    const resourceName = {
        singular: 'url',
        plural: 'urls',
    };

    const changeShowList = () => {
        setShowUrls(true);
    };

    useEffect(() => {
        setPage(0);
    }, [urlList]);

    const handleUrlFieldChange = useCallback((value) => {
        setUrlFieldValue(value);
        value && setIsDirty(true);
    }, []);

    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setShowedAddStoreCoverCounter(showedAddStoreCoverCounter);
    }, [showedAddStoreCoverCounter]);

    useEffect(() => {
        setUrlList(urlList);
    }, [urlList]);

    const removeUrl = async () => {
        setLoadingUrl(true);
        try {
            let response = await fetch('/user-crawl-url-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: selectedItems }),
            });

            const jsonValue = await response.json(); // Get JSON value from the

            setToastContent({ data: jsonValue.data, error: !response.ok });
            setActiveToast(true);
        } catch (error) {
            setToastContent('error');
            setActiveToast(true);
        }

        await getUrlList();
    };

    const addNewUrl = async () => {
        //setLoadingUrl(true);

        setSendLoading(true);
        try {
            let response = await fetch('/user-crawl-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlFieldValue }),
            });

            const jsonValue = await response.json(); // Get JSON value from the

            setToastContent({ data: jsonValue.data, error: !response.ok });
            setActiveToast(true);
        } catch (error) {
            setToastContent('error');
            setActiveToast(true);
        }

        setSendLoading(false);
        await getUrlList();
    };

    const setPage = (index) => {
        let maxIndex = Math.ceil(urlList.length / 10) - 1;

        if (index < 0) {
            index = 0;
        }

        if (index > maxIndex) {
            index = maxIndex;
        }

        if (index === 0) {
            setMinPageIndex(true);
        } else {
            setMinPageIndex(false);
        }

        if (index === maxIndex) {
            setMaxPageIndex(true);
        } else {
            setMaxPageIndex(false);
        }

        setPageIndex(index);
    };

    //MARKUPS

    const emptyStateMarkup = <EmptySearchResult title={'No Store Found'} withIllustration />;

    const promotedBulkActions = [
        {
            content: 'Remove Stores',
            onAction: () => removeUrl(),
        },
    ];

    function resolveItemIds({ id }) {
        return id;
    }

    return (
        <div>
            {toastMarkup}

            {loadingUrl ? (
                <Loading />
            ) : (
                <Page title="Add Store" subtitle="Enter the link of the stores you want to follow below. Add to your list by clicking the button." fullWidth>
                    {showUrls === false ? (
                        <Card sectioned>
                            <EmptyState heading="Add a url to get started" action={{ content: 'Add Store', onAction: () => changeShowList() }} image={addStore} fullWidth>
                                <p>Don't have a store which you follow yet. Click to add a store to your watch list</p>
                            </EmptyState>
                        </Card>
                    ) : (
                        <div>
                            <Card sectioned title="Store Url">
                                <Stack>
                                    <TextField value={urlFieldValue} onChange={handleUrlFieldChange} />

                                    <Button onClick={() => addNewUrl()} loading={sendLoading}>
                                        {' '}
                                        Add
                                    </Button>
                                </Stack>
                            </Card>

                            <Card sectioned>
                                <ResourceList
                                    resourceName={resourceName}
                                    selectedItems={selectedItems}
                                    promotedBulkActions={promotedBulkActions}
                                    onSelectionChange={setSelectedItems}
                                    resolveItemId={resolveItemIds}
                                    emptyState={emptyStateMarkup}
                                    showHeader
                                    items={urlList && urlList.length > 0 ? urlList.slice(10 * pageIndex, 10 * pageIndex + 10) : []}
                                    loading={loadingUrl}
                                    renderItem={(item) => {
                                        const { id, url, website, queueWebsites } = item;
                                        const media = <Avatar customer size="medium" name={website} source={item.websites.faviconUrl ? item.websites.faviconUrl : 'https://polaris.shopify.com/icons/DomainsMajor.svg'} />;

                                        const isLoading = queueWebsites && queueWebsites.length > 0;
                                        return (
                                            <ResourceList.Item id={id} url={url} media={media} persistActions>
                                                <h3>
                                                    <TextStyle variation="strong">{website}</TextStyle>
                                                </h3>
                                                {isLoading ? (
                                                    <Badge progress="partiallyComplete" status="attention">
                                                        Loading
                                                    </Badge>
                                                ) : (
                                                    ''
                                                )}
                                            </ResourceList.Item>
                                        );
                                    }}
                                />

                                <div style={{ marginLeft: '45%' }}>
                                    <Pagination nextTooltip={'Next'} previousTooltip={'Previous'} onPrevious={() => setPage(pageIndex - 1)} onNext={() => setPage(pageIndex + 1)} hasPrevious={!minPageIndex} hasNext={!maxPageIndex} />
                                </div>
                            </Card>
                        </div>
                    )}
                </Page>
            )}
        </div>
    );
}
