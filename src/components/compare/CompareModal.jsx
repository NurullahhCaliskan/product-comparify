import { Button, Modal, TextContainer, Layout, Card, Image, List, FormLayout, TextField, TextStyle, Popover, ActionList, Thumbnail, Avatar, Select } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';
import { cartesian } from '../../utility/objectUtility.js';
import priceWithCurrency from '../../utility/currenctUtility.js';
import { humanReadableTime } from '../../utility/dateUtility.js';
import { getAfterLastCharacter } from '../../utility/stringUtility.js';

export function CompareModal(props) {
    const [active, setActive] = useState(false);

    const [merchantProduct, setMerchantProduct] = useState({});
    const [competitorsProduct, setCompetitorsProduct] = useState({});

    const handleChange = useCallback(() => setActive(!active), [active]);

    const defaultObject = { id: null, handle: null, title: null, images: [], createdAt: null, publishedAt: null, updatedAt: null, variants: [], productType: null, tags: [], vendor: null, mainImage: 'https://polaris.shopify.com/icons/DomainsMajor.svg', variantList: [] };

    const [selectedMerchantVariantOption, setSelectedMerchantVariantOption] = useState('0');
    const [selectedCompetitorVariantOption, setSelectedCompetitorVariantOption] = useState('0');

    const [selectedMerchantVariant, setSelectedMerchantVariant] = useState({});
    const [selectedCompetitorVariant, setSelectedCompetitorVariant] = useState({});

    const handleSelectChangeMerchant = useCallback(async (value) => {
        setSelectedMerchantVariantOption(value);
    }, []);

    const handleSelectChangeCompetitor = useCallback(async (value) => {
        setSelectedCompetitorVariantOption(value);
    }, []);

    const loadMerchantData = () => {
        let merchantProduct = props.merchantProduct.node;
        let data = Object.assign({}, defaultObject);

        data.id = merchantProduct.id;
        data.handle = merchantProduct.handle;
        data.title = merchantProduct.title;
        data.createdAt = merchantProduct.createdAt;
        data.publishedAt = merchantProduct.publishedAt;
        data.updatedAt = merchantProduct.updatedAt;
        data.productType = merchantProduct.productType;
        data.vendor = merchantProduct.vendor;

        data.options = merchantProduct.options;
        data.mainImage = _.get(merchantProduct, 'images.edges[0].node') ? merchantProduct.images.edges[0].node.url : 'https://polaris.shopify.com/icons/DomainsMajor.svg';

        data.variantList = setVariantOptions(merchantProduct.options);

        setMerchantProduct(data);
    };

    const loadCompetitorsData = () => {
        let competitorsProduct = props.competitorsProduct;
        let data = Object.assign({}, defaultObject);

        data.id = competitorsProduct.id;
        data.handle = competitorsProduct.handle;
        data.title = competitorsProduct.title;
        data.createdAt = competitorsProduct.created_at;
        data.publishedAt = competitorsProduct.published_at;
        data.updatedAt = competitorsProduct.updated_at;
        data.productType = competitorsProduct.product_type;
        data.vendor = competitorsProduct.vendor;
        data.mainImage = _.get(competitorsProduct, 'images[0]') ? competitorsProduct.images[0].src : null;

        data.variantList = setVariantOptions(competitorsProduct.options);

        setCompetitorsProduct(data);
    };

    const setVariantOptions = (data) => {
        let variantMatrix = [];

        data.forEach((variant) => {
            let variantList = [];
            variant.values.forEach((variantEntity) => {
                variantList.push(variant.name + ': ' + variantEntity);
            });

            variantMatrix.push(variantList);
        });

        let cartesianMatrix = cartesian(variantMatrix);

        let result = [];

        let idCounter = 0;
        cartesianMatrix.forEach((variant) => {
            result.push({ label: variant.join(', '), value: idCounter.toString() });
            idCounter++;
        });

        return result;
    };

    useEffect(async () => {
        let data = props.merchantProduct.node.variants.edges[selectedMerchantVariantOption].node;

        let result = {};

        result.price = data.price;
        result.compareAtPrice = data.compareAtPrice;
        result.createdAt = data.createdAt;
        result.displayName = data.displayName;
        result.id = data.id;
        result.sku = data.sku;
        result.title = data.title;
        result.updatedAt = data.updatedAt;
        result.weight = data.weight;
        result.weightUnit = data.weightUnit;
        result.currency = props.merchantProduct.node.priceRangeV2.maxVariantPrice.currencyCode;

        console.log('merchantProduct');
        console.log(result);
        setSelectedMerchantVariant(result);
    }, [selectedMerchantVariantOption, props.merchantProduct]);

    useEffect(async () => {
        console.log(props.competitorsProduct);

        let data = props.competitorsProduct.variants[selectedCompetitorVariantOption];

        let result = {};
        result.price = data.price;
        result.compareAtPrice = data.compare_at_price;
        result.createdAt = data.created_at;
        result.displayName = data.parent_title;
        result.id = data.id;
        result.sku = data.sku;
        result.title = data.title;
        result.updatedAt = data.updated_at;
        result.weight = data.grams;
        result.weightUnit = 'gram';
        result.currency = props.competitorsProduct.currency;

        console.log('competitorsProduct');
        console.log(result);
        setSelectedCompetitorVariant(result);
    }, [selectedCompetitorVariantOption, props.competitorsProduct]);

    useEffect(async () => {
        if (props.merchantProduct && props.competitorsProduct) {
            setActive(true);
        }

        if (props.merchantProduct) {
            loadMerchantData();
        }

        if (props.competitorsProduct) {
            loadCompetitorsData();
        }

        console.log(props.merchantProduct);
        console.log(props.competitorsProduct);
    }, [props.merchantProduct, props.competitorsProduct]);

    return (
        <div style={{ height: '500px' }}>
            <Modal open={active} title="Compare Products" onClose={handleChange} large={true}>
                <Modal.Section>
                    <Card>
                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'} />
                                <TextStyle variation={'strong'}>Me</TextStyle>
                                <TextStyle variation="strong">Competitor</TextStyle>
                            </FormLayout.Group>

                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'} />
                                <Thumbnail source={merchantProduct.mainImage} alt="Black choker necklace" />
                                <Thumbnail source={competitorsProduct.mainImage} alt="Black choker necklace" />
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>ID</TextStyle>
                                <TextStyle variation={'subdued'}>{getAfterLastCharacter(merchantProduct.id, '/')}</TextStyle>
                                <TextStyle variation="subdued">{competitorsProduct.id}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Title</TextStyle>
                                <TextStyle variation={'subdued'}>{merchantProduct.title}</TextStyle>
                                <TextStyle variation="subdued">{competitorsProduct.title}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Handle</TextStyle>
                                <TextStyle variation={'subdued'}>{merchantProduct.handle}</TextStyle>
                                <TextStyle variation="subdued">{competitorsProduct.handle}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>
                    </Card>
                </Modal.Section>

                <Modal.Section>
                    <Card>
                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Created at</TextStyle>
                                <TextStyle variation={'subdued'}>{humanReadableTime(merchantProduct.createdAt)}</TextStyle>
                                <TextStyle variation="subdued">{humanReadableTime(competitorsProduct.createdAt)}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Published at</TextStyle>
                                <TextStyle variation={'subdued'}>{humanReadableTime(merchantProduct.publishedAt)}</TextStyle>
                                <TextStyle variation="subdued">{humanReadableTime(competitorsProduct.publishedAt)}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Updated at</TextStyle>
                                <TextStyle variation={'subdued'}>{humanReadableTime(merchantProduct.updatedAt)}</TextStyle>
                                <TextStyle variation="subdued">{humanReadableTime(competitorsProduct.updatedAt)}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>
                    </Card>
                </Modal.Section>

                <Modal.Section>
                    <Card title={'Variants'}>
                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Select Variant</TextStyle>
                                <Select options={merchantProduct.variantList} onChange={handleSelectChangeMerchant} value={selectedMerchantVariantOption} />
                                <Select options={competitorsProduct.variantList} onChange={handleSelectChangeCompetitor} value={selectedCompetitorVariantOption} />
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>ID</TextStyle>
                                <TextStyle variation={'subdued'}>{getAfterLastCharacter(selectedMerchantVariant.id, '/')}</TextStyle>
                                <TextStyle variation="subdued">{selectedCompetitorVariant.id}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>SKU</TextStyle>
                                <TextStyle variation={'subdued'}>{selectedMerchantVariant.sku}</TextStyle>
                                <TextStyle variation="subdued">{selectedCompetitorVariant.sku}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Title</TextStyle>
                                <TextStyle variation={'subdued'}>{selectedMerchantVariant.title}</TextStyle>
                                <TextStyle variation="subdued">{selectedCompetitorVariant.title}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Display Name</TextStyle>
                                <TextStyle variation={'subdued'}>{selectedMerchantVariant.displayName}</TextStyle>
                                <TextStyle variation="subdued">{selectedCompetitorVariant.displayName}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Created At</TextStyle>
                                <TextStyle variation={'subdued'}>{humanReadableTime(selectedMerchantVariant.createdAt)}</TextStyle>
                                <TextStyle variation="subdued">{humanReadableTime(selectedCompetitorVariant.createdAt)}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Updated At</TextStyle>
                                <TextStyle variation={'subdued'}>{humanReadableTime(selectedMerchantVariant.updatedAt)}</TextStyle>
                                <TextStyle variation="subdued">{humanReadableTime(selectedCompetitorVariant.updatedAt)}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>

                        <Card.Section>
                            <FormLayout.Group condensed>
                                <TextStyle variation={'strong'}>Price</TextStyle>
                                <TextStyle variation={'subdued'}>{priceWithCurrency(selectedMerchantVariant.price, selectedMerchantVariant && selectedMerchantVariant.currency ? selectedMerchantVariant.currency : 'USD')}</TextStyle>
                                <TextStyle variation="subdued">{priceWithCurrency(selectedCompetitorVariant.price, selectedCompetitorVariant && selectedCompetitorVariant.currency ? selectedCompetitorVariant.currency : 'USD')}</TextStyle>
                            </FormLayout.Group>
                        </Card.Section>
                    </Card>
                </Modal.Section>
            </Modal>
        </div>
    );
}
