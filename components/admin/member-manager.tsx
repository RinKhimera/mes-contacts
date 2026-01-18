"use client"

import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Crown, User, Search } from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "./status-badge"
import { ConfirmDialog } from "./confirm-dialog"
import { getInitials } from "@/lib/utils"

interface MemberManagerProps {
  organizationId: Id<"organizations">
}

export function MemberManager({ organizationId }: MemberManagerProps) {
  const members = useQuery(api.organizationMembers.getByOrganization, {
    organizationId,
  })
  const allUsers = useQuery(api.users.list)
  const addMember = useMutation(api.organizationMembers.addMember)
  const updateRole = useMutation(api.organizationMembers.updateRole)
  const removeMember = useMutation(api.organizationMembers.removeMember)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [selectedRole, setSelectedRole] = useState<"OWNER" | "MEMBER">("MEMBER")
  const [isAdding, setIsAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<Id<"organizationMembers"> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter out users who are already members
  const memberUserIds = new Set(members?.map((m) => m.userId))
  const availableUsers = allUsers?.filter((u) => !memberUserIds.has(u._id)) || []
  const filteredUsers = availableUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddMember = async () => {
    if (!selectedUserId) return
    setIsAdding(true)
    try {
      await addMember({
        organizationId,
        userId: selectedUserId as Id<"users">,
        role: selectedRole,
      })
      toast.success("Membre ajouté")
      setIsAddDialogOpen(false)
      setSelectedUserId("")
      setSelectedRole("MEMBER")
      setSearchQuery("")
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateRole = async (
    membershipId: Id<"organizationMembers">,
    role: "OWNER" | "MEMBER"
  ) => {
    try {
      await updateRole({ membershipId, role })
      toast.success("Rôle mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const handleRemoveMember = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await removeMember({ membershipId: deleteId })
      toast.success("Membre retiré")
      setDeleteId(null)
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Membres</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 size-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un membre</DialogTitle>
              <DialogDescription>
                Sélectionnez un utilisateur à ajouter à cette organisation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rechercher un utilisateur</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Utilisateur</Label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.length === 0 ? (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        Aucun utilisateur disponible
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarImage src={user.image} />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                            <span className="text-muted-foreground">
                              ({user.email})
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(v) => setSelectedRole(v as "OWNER" | "MEMBER")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">
                      <div className="flex items-center gap-2">
                        <Crown className="size-4 text-amber-500" />
                        Propriétaire
                      </div>
                    </SelectItem>
                    <SelectItem value="MEMBER">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-blue-500" />
                        Membre
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={!selectedUserId || isAdding}
              >
                {isAdding ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members List */}
      <div className="rounded-lg border">
        {!members ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Chargement...
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aucun membre
          </div>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={member.user?.image} />
                    <AvatarFallback>
                      {getInitials(member.user?.name || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.user?.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {member.user?.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={member.role}
                    onValueChange={(v) =>
                      handleUpdateRole(member._id, v as "OWNER" | "MEMBER")
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">
                        <div className="flex items-center gap-2">
                          <Crown className="size-4 text-amber-500" />
                          Propriétaire
                        </div>
                      </SelectItem>
                      <SelectItem value="MEMBER">
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-blue-500" />
                          Membre
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteId(member._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Retirer le membre"
        description="Êtes-vous sûr de vouloir retirer ce membre de l'organisation ?"
        confirmText="Retirer"
        variant="destructive"
        onConfirm={handleRemoveMember}
        isLoading={isDeleting}
      />
    </div>
  )
}
