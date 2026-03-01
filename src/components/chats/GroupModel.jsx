
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { useChatStore } from "../../store/chatStore"
import { useEffect, useState } from "react"

export default function GroupModel({ groupMembers }) {
  const [open, setOpen] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const initialMembers = groupMembers.filter((member) => !member.isGroupChat);
  const [filterMembers, setFilterMembers] = useState(initialMembers);
  const [members, setMembers] = useState([]);
  const { createGroup } = useChatStore();
  const [chatName, setChatName] = useState("");

  useEffect(() => {
    if (searchMember.trim().length > 0) {
      const filtered = initialMembers.filter((member) => {
        const name = member?.isGroupChat ? member?.chatName : member?.users[0]?.fullname;
        return name?.toLowerCase().includes(searchMember.toLowerCase());
      });
      setFilterMembers(filtered);
    } else {
      setFilterMembers(initialMembers);
    }
  }, [searchMember, groupMembers]);

  const handleAddMembers = (member) => {
    if (!members.find(m => m._id === member._id)) {
      setMembers([...members, member]);
    }
  };

  const removeMember = (memberId) => {
    setMembers(members.filter(m => m._id !== memberId));
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!chatName || members.length < 2) return;
    const users = members.map((member) => (member.users[0]._id));
    createGroup({
      chatName: chatName,
      users: users
    });
    setOpen(false);
    setMembers([]);
    setChatName("");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
          <Plus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 sm:w-96 p-0 border shadow-2xl bg-card overflow-hidden" align="end">
        <ScrollArea className="h-110">
          <div className="p-6 bg-muted/30 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              New Group
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Create a group chat with 2 or more people.</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Group Name</Label>
              <Input
                className="bg-muted/50 border-none focus-visible:ring-1 h-10"
                placeholder="e.g. Project Team"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Members</Label>
              <Input
                className="bg-muted/50 border-none focus-visible:ring-1 h-10"
                placeholder="Search contacts..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
              />
            </div>

            {/* Selected Members */}
            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {members.map((member) => (
                  <Badge
                    key={member._id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 gap-1 bg-primary/10 text-primary border-transparent hover:bg-primary/20 transition-colors"

                    onClick={() => removeMember(member._id)}
                  >
                    <span className="text-xs">{member?.users[0]?.fullname}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-foreground"
                    />
                  </Badge>
                ))}
              </div>
            )}

            <div className="pt-2">
              <ScrollArea className="h-44 border rounded-xl bg-muted/20">
                <div className="p-2 space-y-1">
                  {filterMembers.length > 0 ? (
                    filterMembers.map((member) => {
                      const isSelected = members.find(m => m._id === member._id);
                      const name = member?.users[0]?.fullname;
                      return (
                        <div
                          key={member._id}
                          className={`
                          flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                          ${isSelected ? 'bg-primary/5 opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'}
                        `}
                          onClick={() => !isSelected && handleAddMembers(member)}
                        >
                          <span className="text-sm font-medium">{name}</span>
                          {!isSelected && <Plus className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-40">
                      <p className="text-xs">No contacts found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => {

              setOpen(false);
              setMembers([]);
              setChatName("");
            }
            }>Cancel</Button>
            <Button
              size="sm"
              onClick={handleCreateGroup}
              disabled={!chatName || members.length < 2}
            >
              Create Group
            </Button>

          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}