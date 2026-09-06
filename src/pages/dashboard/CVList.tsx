import { useNavigate } from "react-router-dom";
import { FileText, Plus, Wand2, Loader2, Trash2, Calendar, Briefcase, Download, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCVDrafts, useDeleteCVDraft } from "@/hooks/useCVDrafts";
import { useProfile } from "@/hooks/useProfile";
import { useProfileDocuments, useDeleteProfileDocument } from "@/hooks/useProfileDocuments";
import { profileApi, documentsApi, triggerBlobDownload, type CVDraft } from "@/lib/api";
import { toast } from "sonner";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function CVList() {
  const navigate = useNavigate();
  const { data: drafts = [], isLoading } = useCVDrafts();
  const { data: profile } = useProfile();
  const deleteDraft = useDeleteCVDraft();
  const { data: documents = [] } = useProfileDocuments();
  const deleteDocument = useDeleteProfileDocument();
  const filledForms = documents.filter((d) => d.doc_type === "filled_form");

  const handleDownloadForm = async (docId: string, filename: string) => {
    try {
      const blob = await documentsApi.download(docId);
      triggerBlobDownload(blob, filename);
    } catch {
      toast.error("Failed to download document.");
    }
  };

  const handleDeleteForm = async (docId: string) => {
    try {
      await deleteDocument.mutateAsync(docId);
      toast.success("Document removed.");
    } catch {
      toast.error("Failed to remove document.");
    }
  };

  const handleNewBlank = async () => {
    const draftId = `blank-${Date.now()}`;
    const draft: CVDraft = {
      draft_id: draftId,
      job_title: "General CV",
      summary: profile?.summary || "",
      skills: profile?.skills || [],
      experience: profile?.experience || [],
      education: profile?.education || "",
      created_at: new Date().toISOString(),
    };
    try {
      await profileApi.saveDraft(draft);
      navigate(`/cv-editor/${draftId}`);
    } catch {
      toast.error("Could not create a new CV. Please try again.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, draftId: string) => {
    e.stopPropagation();
    try {
      await deleteDraft.mutateAsync(draftId);
      toast.success("Draft deleted.");
    } catch {
      toast.error("Failed to delete draft.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My CVs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? "Loading..." : `${drafts.length} saved draft${drafts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewBlank}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Blank CV
          </Button>
          <Button
            size="sm"
            className="bg-brand-600 hover:bg-brand-700 text-white"
            onClick={() => navigate("/cv-editor/tailor")}
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            Tailor to a job
          </Button>
        </div>
      </div>

      {/* Draft grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : drafts.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-5 py-24">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
            <FileText className="w-8 h-8 text-brand-400" />
          </div>
          <div className="text-center">
            <h2 className="text-base font-medium text-gray-700">No CVs yet</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Tailor a CV to a specific job posting, or start from scratch and edit with Zara.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleNewBlank}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />Start blank
            </Button>
            <Button
              size="sm"
              className="bg-brand-600 hover:bg-brand-700 text-white"
              onClick={() => navigate("/cv-editor/tailor")}
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5" />Tailor to a job
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((draft) => (
            <button
              key={draft.draft_id}
              onClick={() => navigate(`/cv-editor/${draft.draft_id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-left hover:shadow-md hover:border-brand-100 transition-all group relative"
            >
              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(e, draft.draft_id)}
                disabled={deleteDraft.isPending}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* CV icon */}
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-brand-500" />
              </div>

              {/* Title */}
              <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                {draft.job_title || "General CV"}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {draft.job_title && draft.job_title !== "General CV" && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Briefcase className="w-3 h-3" />
                    Tailored
                  </span>
                )}
                {draft.created_at && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(draft.created_at)}
                  </span>
                )}
              </div>

              {/* Skills preview */}
              {draft.skills && draft.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {draft.skills.slice(0, 3).map((s) => (
                    <Badge key={s} className="text-xs bg-gray-100 text-gray-500 border-0">
                      {s}
                    </Badge>
                  ))}
                  {draft.skills.length > 3 && (
                    <Badge className="text-xs bg-gray-100 text-gray-400 border-0">
                      +{draft.skills.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-brand-500 font-medium group-hover:text-brand-600 transition-colors">
                  Edit with Zara →
                </span>
                <div className="flex gap-1.5">
                  {draft.summary && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Summary" />}
                  {draft.skills?.length ? <div className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Skills" /> : null}
                  {draft.experience?.length ? <div className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Experience" /> : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filled forms (from Zara document fills) */}
      {filledForms.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Completed forms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filledForms.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative group"
              >
                <button
                  onClick={() => handleDeleteForm(doc.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                  <FileCheck2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {doc.original_filename}
                </p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-xs text-gray-400">{formatSize(doc.size)}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(doc.created_at)}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs w-full"
                    onClick={() => handleDownloadForm(doc.id, doc.original_filename)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
