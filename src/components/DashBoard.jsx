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
  Button,
  Layout,
  AppProvider,
  Frame,
  TextContainer,
  SkeletonDisplayText,
  SkeletonBodyText,
  Modal,
  IndexTable,
  Avatar,
  TextStyle,
  RangeSlider,
  Icon,
} from "@shopify/polaris";
import {
  ArrowLeftMinor,
  CircleCancelMinor,
  CircleTickMinor,
  ConversationMinor,
  HomeMajor,
  OrdersMajor,
} from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App.jsx";
import mailSend from "../assets/mail-send.webp";

export function DashBoard() {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [mailStatusCode, setMailStatusCode] = useState(null);
  const [mailResponse, setMailResponse] = useState(null);

  const [modalActive, setModalActive] = useState(false);
  const getMailHistory = async () => {
    setLoadingUrl(true);
    const response = await fetch("/get-mail-history").then((res) => res.json());
    setLoadingUrl(false);
    setMailList(response);
  };

  const [mailList, setMailList] = useState(getMailHistory);

  const skipToContentRef = useRef(null);

  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );

  const humanReadableTime = (time) => {
    let date = new Date(time);

    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const sendTestMail = async () => {
    setModalActive(true);
    setLoadingUrl(true);

    try {
      const response = await fetch("/send-test-mail");

      setMailResponse((await response.json()).result);
      setMailStatusCode(response.status);

      await getMailHistory();
    } catch (error) {
      setMailResponse("Something went wrong. Please try again");
      setMailStatusCode(500);
    }
    setLoadingUrl(false);
  };

  const toggleModalActive = useCallback(
    () => setModalActive((modalActive) => !modalActive),
    []
  );

  const testMailMarkup = (
    <Modal
      loading={loadingUrl}
      open={modalActive}
      onClose={toggleModalActive}
      title={loadingUrl ? "Test Mail Sending Please Wait" : mailResponse}
    >
      <Modal.Section>
        <FormLayout>
          <img src={mailSend} />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  const resourceName = {
    singular: "website",
    plural: "websites",
  };

  const rowMarkup =
    mailList && mailList.length > 0
      ? mailList.map(({ createDateTime, status, cachedAlarm, _id }, index) => (
          <IndexTable.Row id={_id} key={_id} position={index}>
            <IndexTable.Cell>
              <TextStyle variation="strong">
                {humanReadableTime(createDateTime)}
              </TextStyle>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <TextStyle variation="strong">{cachedAlarm.length}</TextStyle>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <TextStyle variation="strong">
                <Icon source={status ? CircleTickMinor : CircleCancelMinor} />
              </TextStyle>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))
      : "";

  return (
    <Page title="Dashboard">
      {testMailMarkup}
      <Layout>
        {skipToContentTarget}
        <Layout.AnnotatedSection
          title="Mail"
          description="Sending Mail Details"
        >
          <Card>
            <IndexTable
              loading={loadingUrl}
              resourceName={resourceName}
              itemCount={mailList?.length}
              selectable={false}
              headings={[
                { title: "Sending Date" },
                { title: "Product Count" },
                { title: "Mail Status" },
              ]}
            >
              {rowMarkup}
            </IndexTable>
          </Card>

          <Button primary onClick={() => sendTestMail()}>
            {" "}
            Send Test Mail
          </Button>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}
