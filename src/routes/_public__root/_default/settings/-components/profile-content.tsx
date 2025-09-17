import React from 'react'
import type { User } from 'better-auth'
import { formatDate } from 'date-fns'
import { CreditCard, Key, Stars, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DeleteAccountDialog } from '@/components/User/delete-account-dialog'
import { UpdatePasswordDialog } from '@/components/User/update-password-dialog'
import { FREE_PLAN, PREMIUM_PLAN } from '@/constants/plan'
import { formatCentsToEuros } from '@/helpers/number'
import { usePortal } from '@/hooks/use-portal'
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js'

export const ProfileContent = ({
  user,
  activeSubscription
}: {
  user: User
  activeSubscription: CustomerStateSubscription | null
}) => {
  const { goToPortal, checkoutPortal } = usePortal()
  const [isUpdatePasswordOpened, setIsUpdatePasswordOpened] =
    React.useState(false)
  const [isDeleteAccountOpened, setIsDeleteAccountOpened] =
    React.useState(false)

  return (
    <div>
      <UpdatePasswordDialog
        open={isUpdatePasswordOpened}
        onOpenChange={setIsUpdatePasswordOpened}
        user={user}
      />
      <DeleteAccountDialog
        open={isDeleteAccountOpened}
        onOpenChange={setIsDeleteAccountOpened}
        user={user}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Compte et abonnement</CardTitle>
            <CardDescription>
              Gérez les préférences de votre compte et votre abonnement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex md:items-center justify-between gap-6 flex-col md:flex-row">
              <div className="space-y-1">
                <Label className="text-base">Abonnement en cours</Label>
                {activeSubscription ? (
                  <p className="text-muted-foreground text-sm">
                    {PREMIUM_PLAN.title} -{' '}
                    {formatCentsToEuros(activeSubscription?.amount)}/mois -{' '}
                    <span className="text-info">
                      {activeSubscription.cancelAtPeriodEnd
                        ? `Fin le ${formatDate(activeSubscription.currentPeriodEnd!, 'dd/MM/yyyy')}`
                        : `Renouvellement le ${formatDate(activeSubscription.currentPeriodEnd!, 'dd/MM/yyyy')}`}
                    </span>
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {FREE_PLAN.title} - Gratuit
                  </p>
                )}
              </div>
              {activeSubscription ? (
                <Button
                  variant="outline"
                  onClick={(event) => {
                    event.preventDefault()
                    goToPortal()
                  }}
                >
                  <CreditCard />
                  Gérer mon abonnement
                </Button>
              ) : (
                <Button
                  variant="info"
                  onClick={(event) => {
                    event.preventDefault()
                    checkoutPortal()
                  }}
                >
                  <Stars />
                  Passer à Premium
                </Button>
              )}
            </div>
            <Separator />
            <div className="flex md:items-center justify-between gap-6 flex-col md:flex-row">
              <div className="space-y-1">
                <Label className="text-base">Mot de passe</Label>
                <p className="text-muted-foreground text-sm">
                  Modifier votre mot de passe
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUpdatePasswordOpened(true)
                }}
              >
                <Key />
                Modifier mon mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
            <CardDescription>
              Actions irréversibles et destructrices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex md:items-center justify-between gap-6 flex-col md:flex-row">
              <div className="space-y-1">
                <Label className="text-base">Supprimer mon compte</Label>
                <p className="text-muted-foreground text-sm">
                  Supprimer définitivement votre compte et toutes vos données
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteAccountOpened(true)
                }}
              >
                <Trash2 />
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
