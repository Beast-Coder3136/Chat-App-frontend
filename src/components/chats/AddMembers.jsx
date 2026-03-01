import { useAuthStore } from "@/store/autStore";
import { useChatStore } from "@/store/chatStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, X, UserPlus, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const AddMembers = ({ groupId, groupMembers }) => {
  const { addMembers } = useChatStore();
  const { users, searchUser , setUsers  } = useAuthStore();
  const [addUsers, setAddUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddMember = (user) => {
    if (!groupMembers.find((member) => member._id === user._id) && !addUsers.find((u) => u._id === user._id)) {
      setAddUsers([...addUsers, user]);
    }
  };

  const removeMember = (userId) => {
    setAddUsers(addUsers.filter((u) => u._id !== userId));
  };

  const handleSubmit = () => {
    if (addUsers.length === 0) return;
    const userIds = addUsers.map((u) => u._id);
    addMembers({
      groupId: groupId,
      newUsers: userIds,
    });
    setOpen(false);
    setAddUsers([]);
    setUsers([])
    setSearchQuery("");
  };

  // Improved search with debounce
  useEffect(() => {
    if (searchQuery.trim()) {
      const delayDebounceFn = setTimeout(() => {
        searchUser(searchQuery);
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, searchUser]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors "
        >
          <UserPlus className="size-xs" /> 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 sm:w-96 p-0 border shadow-2xl bg-card overflow-hidden"
        align="end"
      >
        <div className="p-6 bg-muted/30 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Members
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Search and add new members to this group chat.
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Search Users
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="bg-muted/50 border-none focus-visible:ring-1 h-10 pl-9"
                placeholder="Name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Selected Members */}
          {addUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {addUsers.map((user) => (
                <Badge
                  key={user._id}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 gap-1 bg-primary/10 text-primary border-transparent hover:bg-primary/20 transition-colors cursor-pointer"
                  onClick={() => removeMember(user._id)}
                >
                  <span className="text-xs">{user.fullname}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-foreground "
                  />
                </Badge>
              ))}
            </div>
          )}

          <div className="pt-2">
            <ScrollArea className="h-44 border rounded-xl bg-muted/20">
              <div className="p-2 space-y-1">
                {users && users.length > 0 ? (
                  users.map((user) => {
                    const isSelected = addUsers.find((u) => u._id === user._id);
                    return (
                      <div
                        key={user._id}
                        className={`
                          flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                          ${isSelected
                            ? "bg-primary/5 opacity-50 cursor-not-allowed"
                            : "hover:bg-muted/50"
                          }
                        `}
                        onClick={() => !isSelected && handleAddMember(user)}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user.fullname}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                            {user.email}
                          </span>
                        </div>
                        {!isSelected && (
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <p className="text-xs">
                      {searchQuery ? "No users found" : "Search to find users"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="p-4 bg-muted/30 border-t flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => {
            setOpen(false);
            setAddUsers([]);
            setUsers([])
            setSearchQuery("");
          }
          }>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={addUsers.length === 0}
          >
            Add to Group
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddMembers;
