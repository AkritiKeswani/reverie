import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Plus, Calendar, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import JournalApp from "@/components/journal-app";

export default function HomePage() {
  return <JournalApp />;
}
