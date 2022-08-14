import { Icon, Layout, Page, Subheading, Tooltip } from '@shopify/polaris';
import { MerchantProductCard } from './MerchantProductCard.jsx';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import { useState } from 'react';
import { CompetitorsProductsCard } from './CompetitorsProductsCard.jsx';
import { CompareModal } from './CompareModal.jsx';
import compareGif from '../../assets/info/compare.gif';
import { QuestionMarkInverseMajor } from '@shopify/polaris-icons';

export function Compare() {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [selectedMerchantProduct, setSelectedMerchantProduct] = useState(null);
    const [selectedCompetitorsProduct, setSelectedCompetitorsProduct] = useState(null);

    const selectMerchantProduct = async (item) => {
        setSelectedMerchantProduct(item);
    };

    const selectCompetitorsProduct = async (item) => {
        setSelectedCompetitorsProduct(item);
    };

    const resetCompetitorsProduct = async () => {
        setSelectedCompetitorsProduct(null);
    };

    return (
        <Page
            compactTitle
            title="Compare"
            titleMetadata={
                <Tooltip
                    content={
                        <img
                            alt=""
                            width="100%"
                            height="100%"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                            src={compareGif}
                        />
                    }
                >
                    <Icon source={QuestionMarkInverseMajor} color="base" />
                </Tooltip>
            }
            subtitle="To use the comparison structure, first select a product available in your store. Next, select the product you want to compare."
        >
            <Subheading>Comparisons can be made with only one product.</Subheading>
            <br />
            <Layout>
                <Layout.Section secondary>
                    <MerchantProductCard selectProduct={(item) => selectMerchantProduct(item)} />
                </Layout.Section>
                <Layout.Section secondary>
                    <CompetitorsProductsCard merchantProduct={selectedMerchantProduct} selectProduct={(item) => selectCompetitorsProduct(item)} competitorsProduct={selectedCompetitorsProduct} />
                </Layout.Section>
                <CompareModal merchantProduct={selectedMerchantProduct} competitorsProduct={selectedCompetitorsProduct} resetCompetitorsProduct={() => resetCompetitorsProduct()} />
            </Layout>
        </Page>
    );
}
