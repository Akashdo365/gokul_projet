import { Header } from "@/components/Header";
import { useScanLogs } from "@/hooks/use-logs";
import { useSpeech } from "@/hooks/use-speech";
import { Loader2, Eye, Type, Coins, Clock } from "lucide-react";

export default function History() {
  const { data: logs, isLoading } = useScanLogs();
  const { speak } = useSpeech();

  const getIcon = (type: string) => {
    switch(type) {
      case 'text': return <Type className="w-6 h-6" />;
      case 'currency': return <Coins className="w-6 h-6" />;
      default: return <Eye className="w-6 h-6" />;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header title="Scan History" />

      <main className="max-w-md mx-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : logs?.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No history yet. Start scanning!
          </div>
        ) : (
          logs?.map((log) => (
            <div 
              key={log.id} 
              className="bg-secondary rounded-2xl p-5 border border-border flex gap-4 items-start active:bg-secondary/80 transition-colors"
              onClick={() => speak(`${log.type} scan: ${log.result}`)}
              role="button"
              tabIndex={0}
            >
              <div className="p-3 bg-background rounded-full text-primary border border-border shrink-0">
                {getIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/80">
                    {log.type}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(String(log.timestamp))}
                  </div>
                </div>
                <p className="text-lg font-medium text-foreground leading-snug line-clamp-2">
                  {log.result}
                </p>
                {log.confidence && (
                  <span className="text-xs text-muted-foreground mt-2 block">
                    Confidence: {log.confidence}%
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
