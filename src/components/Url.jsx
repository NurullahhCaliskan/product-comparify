import { useCallback, useRef, useState, useEffect } from "react";
import {
  Toast,
  Page,
  Card,
  FormLayout,
  TextField,
  Layout,
  Button,
  ResourceList,
  TextStyle,
  Avatar,
  Pagination,
} from "@shopify/polaris";
import { DeleteMinor } from "@shopify/polaris-icons";
import { userLoggedInFetch } from "../App";
import { useAppBridge } from "@shopify/app-bridge-react";

export function Url() {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const [activeToast, setActiveToast] = useState(false);
  const [toastContent, setToastContent] = useState({ data: "", error: false });

  const [pageIndex, setPageIndex] = useState(0);
  const [minPageIndex, setMinPageIndex] = useState(true);
  const [maxPageIndex, setMaxPageIndex] = useState(true);

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

    //setPage(0)
  };

  const defaultState = useRef({
    urlFieldValue: "www.shopify.com",
  });

  const [urlFieldValue, setUrlFieldValue] = useState(
    defaultState.current.urlFieldValue
  );

  const [urlList, setUrlList] = useState(getUrlList);

  useEffect(() => {
    setPage(0);
  }, [urlList]);

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
                items={
                  urlList && urlList.length > 0
                    ? urlList.slice(10 * pageIndex, 10 * pageIndex + 10)
                    : []
                }
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

              <div style={{ marginLeft: "40%" }}>
                <Pagination
                  nextTooltip={"Next"}
                  previousTooltip={"Previous"}
                  onPrevious={() => setPage(pageIndex - 1)}
                  onNext={() => setPage(pageIndex + 1)}
                  hasPrevious={!minPageIndex}
                  hasNext={!maxPageIndex}
                />
              </div>
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
