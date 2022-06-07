import { useCallback, useRef, useState } from "react";
import {
  ContextualSaveBar,
  Toast,
  TopBar,
  ActionList,
  Navigation,
  Page,
  Loading,
  Card,
  FormLayout,
  TextField,
  SkeletonPage,
  Layout,
  AppProvider,
  Frame,
  TextContainer,
  SkeletonDisplayText,
  SkeletonBodyText,
  Modal,
  Button,
  ResourceList,
  TextStyle,
  Avatar,
  Icon,
} from "@shopify/polaris";
import {
  ArrowLeftMinor,
  ConversationMinor,
  HomeMajor,
  OrdersMajor,
  DeleteMinor,
} from "@shopify/polaris-icons";
import { userLoggedInFetch } from "../App";
import { useAppBridge } from "@shopify/app-bridge-react";

export function Url() {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const [activeToast, setActiveToast] = useState(false);
  const [toastContent, setToastContent] = useState({ data: "", error: false });
  const toggleActive = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );

  const toastMarkup = activeToast ? (
    <Toast
      content={toastContent.data}
      error={toastContent.error}
      onDismiss={toggleActive}
    />
  ) : null;

  const [loadingUrl, setLoadingUrl] = useState(false);

  const getUrlList = async () => {
    const response = await fetch("/user-crawl-url").then((res) => res.json());

    setUrlList(response);

    setLoadingUrl(false);
  };

  const defaultState = useRef({
    urlFieldValue: "www.shopify.com",
  });

  const [urlFieldValue, setUrlFieldValue] = useState(
    defaultState.current.urlFieldValue
  );

  const [urlList, setUrlList] = useState(getUrlList);

  const skipToContentRef = useRef(null);
  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );

  const handleUrlFieldChange = useCallback((value) => {
    setUrlFieldValue(value);
    value && setIsDirty(true);
  }, []);

  const [isDirty, setIsDirty] = useState(false);

  const removeUrl = async (item) => {
    setLoadingUrl(true);
    try {
      let response = await fetch(
        "/user-crawl-url?id=" + JSON.stringify(item._id),
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const jsonValue = await response.json(); // Get JSON value from the

      setToastContent({ data: jsonValue.data, error: !response.ok });
      setActiveToast(true);
    } catch (error) {
      setToastContent("error");
      setActiveToast(true);
    }

    await getUrlList();
  };

  const addNewUrl = async () => {
    setLoadingUrl(true);

    try {
      let response = await fetch("/user-crawl-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlFieldValue }),
      });

      const jsonValue = await response.json(); // Get JSON value from the

      setToastContent({ data: jsonValue.data, error: !response.ok });
      setActiveToast(true);
    } catch (error) {
      setToastContent("error");
      setActiveToast(true);
    }

    await getUrlList();
  };

  return (
    <div>
      {toastMarkup}

      <Page title="Url">
        <Layout>
          {skipToContentTarget}
          <Layout.AnnotatedSection
            title="Url details"
            description="Please add url which want to notify."
          >
            <Card>
              <ResourceList
                showHeader
                items={urlList}
                loading={loadingUrl}
                renderItem={(item) => {
                  const { id, url, website } = item;
                  const media = (
                    <Avatar
                      customer
                      size="medium"
                      name={website}
                      source={item.websites.faviconUrl}
                    />
                  );
                  const shortcutActions = [
                    { icon: DeleteMinor, onClick: () => removeUrl(item) },
                  ];
                  return (
                    <ResourceList.Item
                      id={id}
                      url={url}
                      media={media}
                      shortcutActions={shortcutActions}
                      persistActions
                    >
                      <h3>
                        <TextStyle variation="strong">{website}</TextStyle>
                      </h3>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>

            <Card sectioned>
              <FormLayout>
                <TextField
                  label="Url"
                  value={urlFieldValue}
                  onChange={handleUrlFieldChange}
                />

                <Button onClick={() => addNewUrl()}> Add</Button>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </div>
  );
}
