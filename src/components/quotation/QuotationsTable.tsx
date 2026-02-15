import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LaravelPaginator } from "@/types/paginator"
import type { GeneratePdfPayload, QuotationListItem } from "@/types/quotation"
import { FileTextIcon, PencilIcon, TrashIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useQuotationService } from "@/services/quotationService"
import { useEffect, useState } from "react"
import { TablePagination } from "../TablePagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { DialogPdfQuotation } from "./DialogPdfQuotation"
import { DialogPdfOptions } from "./DialogPdfOptions"

interface QuotationsTableProps {
  page: number
  perPage: number
}

export function QuotationsTable({ page, perPage }: QuotationsTableProps) {
  const { list, loading, deleteById, generatePdf } = useQuotationService();
  const [open, setOpen] = useState(false);
  const [cbDelete, setCbDelete] = useState<() => void>();
  const [paginator, setPaginator] = useState<LaravelPaginator<QuotationListItem>>();
  const [pdfOptionsOpen, setPdfOptionsOpen] = useState(false);
  const [pdfViewOpen, setPdfViewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDeleteClick = (id: number) => {
    setCbDelete(() => {
      return () => deleteById(id).then(() => {
        toast.success("Cotización eliminada")
        setCbDelete(() => null);
        getQuotations({ per_page: perPage, page: page })
      })
    })
    setOpen(true);
  }

  const getQuotations = (filters: { per_page: number, page: number }) => {
    return list(filters).then(response => {
      setPaginator(response.data);
    });
  }

  const handlePdfClick = (quotationId: number) => {
    setSelectedQuotationId(quotationId);
    setPdfOptionsOpen(true);
  }

  const handleGeneratePdf = async (options: GeneratePdfPayload) => {
    if (!selectedQuotationId) return;

    setPdfLoading(true);
    try {
      const blob = await generatePdf(selectedQuotationId, options);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfOptionsOpen(false);
      setPdfViewOpen(true);
    } catch (error) {
      toast.error("Error al generar el PDF");
    } finally {
      setPdfLoading(false);
    }
  }

  useEffect(() => {
    if (!pdfViewOpen && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl('');
    }
  }, [pdfViewOpen]);

  useEffect(() => {
    const filters = { per_page: perPage, page: page };
    getQuotations(filters);
  }, [page, perPage])

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  if (loading) return <p className="p-4">Cargando...</p>

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la cotización permanentemente y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={cbDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Acciones</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginator?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No hay cotizaciones registradas
              </TableCell>
            </TableRow>
          )}
          {paginator?.data.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileTextIcon
                    className="cursor-pointer hover:text-primary transition-colors h-4 w-4"
                    onClick={() => handlePdfClick(quotation.id)}
                    title="Generar PDF"
                  />
                  <Link to="/dashboard/quotations/$id/edit" params={{ id: String(quotation.id) }}>
                    <PencilIcon
                      className="cursor-pointer hover:text-primary transition-colors h-4 w-4"
                    />
                  </Link>
                  <TrashIcon
                    className="cursor-pointer hover:text-destructive transition-colors h-4 w-4"
                    onClick={() => handleDeleteClick(quotation.id)}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{quotation.number}</TableCell>
              <TableCell>{formatDate(quotation.date)}</TableCell>
              <TableCell>{formatDate(quotation.due_date)}</TableCell>
              <TableCell>{quotation.client_name}</TableCell>
              <TableCell>{quotation.company_name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(quotation.total, quotation.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <TablePagination paginator={paginator}></TablePagination>
      </div>
      <DialogPdfOptions
        open={pdfOptionsOpen}
        setOpen={setPdfOptionsOpen}
        onGenerate={handleGeneratePdf}
        loading={pdfLoading}
      />
      <DialogPdfQuotation
        open={pdfViewOpen}
        setOpen={setPdfViewOpen}
        url={pdfUrl}
      />
    </div>
  )
}
