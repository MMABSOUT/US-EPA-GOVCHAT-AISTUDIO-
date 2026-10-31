import { IconCheck, IconTrash, IconX } from '@tabler/icons-react';
import { FC, useState } from 'react';

import { useTranslation } from 'next-i18next';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';
import { SidebarButton } from '@/components/Sidebar/SidebarButton';

interface Props {
  onClearConversations: () => void;
}

export const ClearConversations: FC<Props> = ({ onClearConversations }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const { t } = useTranslation('sidebar');

  const handleClearConversations = () => {
    onClearConversations();
    setIsConfirming(false);
  };

  return isConfirming ? (
    <div
      role="region"
      aria-label={t('Confirm clearing conversations') || 'Confirm clearing conversations'}
      className="flex w-full items-center rounded-lg py-3 px-3 text-black transition-colors duration-200 hover:bg-gray-500/10"
    >
      <IconTrash size={18} />

      <div className="ml-3 flex-1 text-left text-[12.5px] leading-3 text-black">
        {t('Are you sure?')}
      </div>

      <div className="flex items-center">
        <SidebarActionButton
          handleClick={(e) => {
            e.stopPropagation();
            handleClearConversations();
          }}
          title={t('Confirm clear conversations') || 'Confirm clear conversations'}
        >
          <IconCheck size={18} />
        </SidebarActionButton>

        <SidebarActionButton
          handleClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
          title={t('Cancel') || 'Cancel'}
        >
          <IconX size={18} />
        </SidebarActionButton>
      </div>
    </div>
  ) : (
    <SidebarButton
      text={t('Clear conversations')}
      icon={<IconTrash size={18} />}
      onClick={() => setIsConfirming(true)}
    />
  );
};
