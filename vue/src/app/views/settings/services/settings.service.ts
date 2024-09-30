import { markRaw } from 'vue'
import { AxiosError } from 'axios'

import PasswordModal from '@/app/components/modal/templates/password.modal.vue'
import UploadImageModalComponent from '@/app/components/modal/templates/image-upload.modal.vue'

import { ModalStore, useModalStore } from '@/app/store/modal.store'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { ToastStore, useToastStore } from '@/app/store/toast.store'

import {
  DeleteAccount,
  DeleteAccountDto,
  UpdateEmail,
  UpdateEmailDto,
  UpdatePassword,
  UpdatePasswordDto,
  UpdateProfile,
  UpdateProfileDto
} from '@/library/dto/user.dto'
import ConfirmModal from '@/app/components/modal/templates/confirm.modal.vue'

class SettingsService {
  public static updateAvatar = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { updateAvatar }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(UploadImageModalComponent),
      properties: {
        callback: async ({ image }: { image: File }): Promise<void> => {
          await updateAvatar(image)
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        },
        title: 'administration.settings.profile.avatar.modal-title',
        action: 'actions.update-avatar'
      }
    })
  }

  public static removeAvatar = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { addToast }: ToastStore = useToastStore()

    console.log('HELLO')

    openModal({
      view: markRaw(ConfirmModal),
      properties: {
        close: closeModal,
        callback: async (): Promise<void> => {
          addToast({ title: 'TEST', body: 'MESSAGE' })
        },
        title: 'Remove your profile picture',
        body: 'Are you sure you want to remove your profile picture?',
        action: 'Remove Profile Picture'
      }
    })
  }

  public static updateEmail = async (props: UpdateEmail): Promise<void> => {
    const { updateEmail }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updateEmail(new UpdateEmailDto(props)).catch((error: AxiosError) =>
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
    )
  }

  public static updatePassword = async (props: UpdatePassword): Promise<void> => {
    const { updatePassword }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updatePassword(new UpdatePasswordDto(props)).catch((error: AxiosError) =>
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
    )
  }

  public static updateProfile = async (props: UpdateProfile): Promise<void> => {
    const { updateProfile }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    await updateProfile(new UpdateProfileDto(props)).catch((error: AxiosError) =>
      addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
    )
  }

  public static disableAccount = (): void => {
    const { openModal, closeModal }: ModalStore = useModalStore()
    const { deleteAccount }: AuthStore = useAuthStore()
    const { addToast }: ToastStore = useToastStore()

    openModal({
      view: markRaw(PasswordModal),
      size: 'md',
      properties: {
        close: closeModal,
        callback: async (props: DeleteAccount): Promise<void> => {
          await deleteAccount(new DeleteAccountDto(props))
            .then(closeModal)
            .catch((error: AxiosError) =>
              addToast({ title: error.response?.statusText || 'ERROR', body: error.message })
            )
        },
        title: 'authentication.disable-account.modal-title',
        body: 'authentication.disable-account.modal-body',
        action: 'actions.disable-account'
      }
    })
  }
}

export { SettingsService }
