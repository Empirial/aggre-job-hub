import { useState } from "react";
import { Save, Eye, EyeOff, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const [showKey, setShowKey] = useState(false);
  const [profile, setProfile] = useState({
    name: "Lufuno Mphela",
    email: "lufuno@mphelaindustries.co.za",
    phone: "+27 73 000 0000",
    linkedin: "linkedin.com/in/lufunomphela",
  });
  const [keywords, setKeywords] = useState(["React", "Python", "Full Stack", "Software Engineer"]);
  const [locations, setLocations] = useState(["Johannesburg", "Remote", "Pretoria"]);
  const [jobTypes, setJobTypes] = useState({ fullTime: true, remote: true, contract: false });
  const [api, setApi] = useState({
    deepseekKey: "sk-••••••••••••••••••••••••••••••••",
    schedule: "0 6 * * *",
    senderEmail: "lufuno@mphelaindustries.co.za",
  });
  const [kwInput, setKwInput] = useState("");
  const [locInput, setLocInput] = useState("");

  const addTag = (
    list: string[],
    setList: (v: string[]) => void,
    input: string,
    setInput: (v: string) => void
  ) => {
    const val = input.trim();
    if (val && !list.includes(val)) setList([...list, val]);
    setInput("");
  };

  const removeTag = (list: string[], setList: (v: string[]) => void, tag: string) =>
    setList(list.filter((t) => t !== tag));

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your profile, preferences, and API configuration</p>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Full Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Email</Label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Phone</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">LinkedIn URL</Label>
              <Input
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="outline">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Preferences */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Job Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Keywords</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {keywords.map((kw) => (
                <Badge key={kw} className="bg-indigo-50 text-indigo-600 border-0 text-xs pr-1.5 flex items-center gap-1">
                  {kw}
                  <button onClick={() => removeTag(keywords, setKeywords, kw)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(keywords, setKeywords, kwInput, setKwInput)}
                placeholder="Add keyword..."
                className="text-sm border-gray-200 h-8"
              />
              <Button size="sm" variant="outline" className="h-8"
                onClick={() => addTag(keywords, setKeywords, kwInput, setKwInput)}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Preferred Locations</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {locations.map((loc) => (
                <Badge key={loc} className="bg-gray-100 text-gray-600 border-0 text-xs pr-1.5 flex items-center gap-1">
                  {loc}
                  <button onClick={() => removeTag(locations, setLocations, loc)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(locations, setLocations, locInput, setLocInput)}
                placeholder="Add location..."
                className="text-sm border-gray-200 h-8"
              />
              <Button size="sm" variant="outline" className="h-8"
                onClick={() => addTag(locations, setLocations, locInput, setLocInput)}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Job Types</Label>
            <div className="flex gap-5">
              {[
                { key: "fullTime", label: "Full-time" },
                { key: "remote", label: "Remote" },
                { key: "contract", label: "Contract" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={jobTypes[key as keyof typeof jobTypes]}
                    onCheckedChange={(v) => setJobTypes({ ...jobTypes, [key]: !!v })}
                  />
                  <Label htmlFor={key} className="text-sm text-gray-600 cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm" variant="outline">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Config */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">DeepSeek API Key</Label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={api.deepseekKey}
                onChange={(e) => setApi({ ...api, deepseekKey: e.target.value })}
                className="text-sm border-gray-200 pr-10"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Scraper Schedule (cron)</Label>
            <Input
              value={api.schedule}
              onChange={(e) => setApi({ ...api, schedule: e.target.value })}
              className="text-sm border-gray-200 font-mono"
            />
            <p className="text-xs text-gray-400">Default: every day at 6:00 AM</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Sender Email</Label>
            <Input
              value={api.senderEmail}
              onChange={(e) => setApi({ ...api, senderEmail: e.target.value })}
              className="text-sm border-gray-200"
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="outline">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Config
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
