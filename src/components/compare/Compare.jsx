import { Banner, Card, IndexTable, Page, Subheading, MediaCard, Popover, Badge, Button, VideoThumbnail, ActionList, DisplayText, TextStyle, Thumbnail, Layout, ResourceList, Tooltip, Icon } from '@shopify/polaris';
import { Loading } from '../../helper/Loading.jsx';
import { MerchantProductCard } from './MerchantProductCard.jsx';
import axios from 'axios';
import { ProductsCard } from '../ProductsCard.jsx';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import { useEffect, useState } from 'react';
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
            subtitle="To use the comparison structure, first select a product available in your store. Next, select the product you want to compare and click the 'Search' button."
        >
            <Subheading>Comparisons can be made with only one product.</Subheading>
            <br />
            <Layout>
                <Layout.Section secondary>
                    <MerchantProductCard selectProduct={(item) => selectMerchantProduct(item)} />
                </Layout.Section>
                <Layout.Section secondary>
                    <CompetitorsProductsCard merchantProduct={selectedMerchantProduct} selectProduct={(item) => selectCompetitorsProduct(item)} />
                </Layout.Section>
                <CompareModal merchantProduct={selectedMerchantProduct} competitorsProduct={selectedCompetitorsProduct} />
            </Layout>
        </Page>
    );
}
