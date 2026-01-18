import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

export default function LoadingFallback() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyTitle>Memuat data...</EmptyTitle>
                <EmptyDescription>Harap tunggu sebentar.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <EmptyMedia variant="default">
                    <Spinner />
                </EmptyMedia>
            </EmptyContent>
        </Empty>
    )
}

