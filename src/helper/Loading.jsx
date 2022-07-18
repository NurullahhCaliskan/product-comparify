import { Card, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer } from '@shopify/polaris';

export function Loading() {
    return (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={9} />
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );
}
