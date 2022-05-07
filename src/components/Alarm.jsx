import { useCallback, useRef, useState } from "react";
import {
    ContextualSaveBar, Toast, TopBar, ActionList, Navigation, Page, Loading, Card, FormLayout, TextField, SkeletonPage, Layout,
    AppProvider, Frame, TextContainer, SkeletonDisplayText, SkeletonBodyText, Modal, Button, ResourceList,
    TextStyle, Avatar, Icon, Checkbox, IndexTable, RangeSlider
} from "@shopify/polaris"
import { ArrowLeftMinor, ConversationMinor, HomeMajor, OrdersMajor, DeleteMinor, CircleCancelMinor, CircleTickMinor } from '@shopify/polaris-icons';
import { userLoggedInFetch } from "../App";
import { useAppBridge } from "@shopify/app-bridge-react";

export function Alarm() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);
    const [activeToast, setActiveToast] = useState(false);
    const [toastContent, setToastContent] = useState({data: "", error: false});
    const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);


    const toastMarkup = activeToast ? (
        <Toast content={toastContent.data} error={toastContent.error} onDismiss={toggleActive}/>
    ) : null;

    const [loadingUrl, setLoadingUrl] = useState(false);

    const getUrlList = async () => {
        setLoadingUrl(true)
        const response = await fetch("/user-crawl-url").then((res) => res.json());

        setUrlList(response);

        setLoadingUrl(false)
    }

    const defaultState = useRef({
        urlFieldValue: 'www.shopify.com'
    });

    const [urlFieldValue, setUrlFieldValue] = useState(defaultState.current.urlFieldValue);

    const [urlList, setUrlList] = useState(getUrlList);


    const skipToContentRef = useRef(null);
    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1}/>
    );

    const handleUrlFieldChange = useCallback((value) => {
        setUrlFieldValue(value);
        value && setIsDirty(true);
    }, []);

    const [isDirty, setIsDirty] = useState(false);

    const radioButtonKeyListener = async (item) => {
        console.log(item)

        if (loadingUrl) {
            return;
        }

        setLoadingUrl(true)

        try {
            let response = await fetch("/user-crawl-url", {
                method: 'PUT', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url: item.website, alarm: item.alarm, value: item.value})
            })

            const jsonValue = await response.json(); // Get JSON value from the

            setToastContent({data: jsonValue.data, error: !response.ok})
            setActiveToast(true)

        } catch (error) {
            setToastContent("error")
            setActiveToast(true)
        }

        await getUrlList();
    }
    const updateAlarm = async (item) => {
        if (loadingUrl) {
            return;
        }

        setLoadingUrl(true)

        try {
            let response = await fetch("/user-crawl-url", {
                method: 'PUT', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url: item.website, alarm: !item.alarm, value: item.value})
            })

            const jsonValue = await response.json(); // Get JSON value from the

            setToastContent({data: jsonValue.data, error: !response.ok})
            setActiveToast(true)

        } catch (error) {
            setToastContent("error")
            setActiveToast(true)
        }

        await getUrlList();
    }


    const [rangeValue, setRangeValue2] = useState([{myValue: 10}]);


    const setRangeValue = (e, index) => {
        setRangeValue2([{myValue: e}])

        let newUrlList = urlList
        newUrlList[index].value = e

        setUrlList(newUrlList)
    }
    const resourceName = {
        singular: 'website',
        plural: 'websites',
    };


    const suffixStyles = {
        minWidth: '24px',
        textAlign: 'right',
    };
    const rowMarkup = urlList && urlList.length > 0 ? urlList.map(
        ({id, website, websites, location, alarm, amountSpent, value}, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                position={index}

            >
                <IndexTable.Cell>
                    <Avatar customer size="medium" name={website} source={websites?.faviconUrl}/>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <TextStyle variation="strong">{website}</TextStyle>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div onClickCapture={() => radioButtonKeyListener(urlList[index])}>
                        <RangeSlider
                            min={-50}
                            max={100}
                            value={value}
                            onChange={(e) => setRangeValue(e, index)}
                            suffix={<p style={suffixStyles}>{value}</p>}
                            output
                            disabled={!alarm}
                        />
                    </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div onClick={() => updateAlarm(urlList[index])}>
                        <Icon
                            source={alarm ? CircleTickMinor : CircleCancelMinor}

                        />
                    </div>
                </IndexTable.Cell>
                <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    ) : "";

    return (<div>

        {toastMarkup}

        <Page title="Alarm">
            <Layout>
                {skipToContentTarget}
                <Layout.AnnotatedSection
                    title="Alarm Configurations"
                    description="You can manage an alarm according to the website you want."
                >
                    <Card>
                        <IndexTable
                            loading={loadingUrl}
                            resourceName={resourceName}
                            itemCount={urlList?.length}
                            selectable={false}
                            headings={[
                                {title: 'Icon'},
                                {title: 'Website'},
                                {title: 'Send Alarm When %x Price'},
                                {title: 'Alarm Status'},
                            ]}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </Card>

                </Layout.AnnotatedSection>
            </Layout>
        </Page>
    </div>)
}
