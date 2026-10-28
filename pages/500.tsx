import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Custom500() {
  const { t } = useTranslation('common');

  return (
    <div className="flex h-screen items-center justify-center bg-[#202123] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">500</h1>
        <p className="mt-2 text-lg">{t('500 - Server-side error occurred', 'Server error')}</p>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
