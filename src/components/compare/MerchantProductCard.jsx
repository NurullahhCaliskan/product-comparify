import { Avatar, Button, Card, Filters, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { userLoggedInFetch } from '../../App.jsx';
import _ from 'lodash';
import priceWithCurrency from '../../utility/currenctUtility.js';

export function MerchantProductCard(prop) {
    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    const [queryValue, setQueryValue] = useState(null);
    const [items, setItems] = useState([]);

    const [loadingUrl, setLoadingUrl] = useState(false);

    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const getMerchantsProducts = async () => {
        try {
            setLoadingUrl(true);
            const productListResponse = await fetch('/merchant-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    search: queryValue,
                }),
            }).then((res) => res.json());

            setItems(productListResponse.body.data.products.edges);
        } catch (e) {
            setItems([]);
        }
        setLoadingUrl(false);
    };

    useEffect(async () => {
        await getMerchantsProducts();
    }, []);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const filters = [];

    const filterControl = (
        <Filters queryValue={queryValue} filters={filters} onQueryChange={setQueryValue} onQueryClear={handleQueryValueRemove} onClearAll={handleClearAll}>
            <div style={{ paddingLeft: '8px' }}>
                <Button onClick={() => getMerchantsProducts()}>Search</Button>
            </div>
        </Filters>
    );

    return (
        <Card>
            <ResourceList loading={loadingUrl} resourceName={resourceName} items={items} renderItem={renderItem} filterControl={filterControl} />
        </Card>
    );

    function renderItem(item) {
        const { id, title, handle, priceRangeV2, images } = item.node;

        const media = <Avatar customer size="medium" name={id} source={_.get(images, 'edges[0].node') ? images.edges[0].node.url : 'https://polaris.shopify.com/icons/DomainsMajor.svg'} />;

        return (
            <ResourceItem id={id} media={media} onClick={() => prop.selectProduct(item)}>
                <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                </h3>
                <div>{priceWithCurrency(priceRangeV2.minVariantPrice.amount, priceRangeV2.minVariantPrice.currencyCode)} </div>
            </ResourceItem>
        );
    }
}
