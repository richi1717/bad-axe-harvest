import { useState, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useInventory } from "../hooks/useInventory";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";

function stockColor(stock: number): string {
  if (stock < 0) return "#EF4444";
  if (stock === 0) return "#EF4444";
  if (stock <= 5) return "#F59E0B";
  return "#10B981";
}

interface AuditRowProps {
  product: Product;
  stock: number;
  original: number;
  editing: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function AuditRow({
  product,
  stock,
  original,
  editing,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: AuditRowProps) {
  const changed = stock !== original;
  const delta = stock - original;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.75,
          bgcolor: changed ? "rgba(245,158,11,0.06)" : "transparent",
          transition: "background-color 0.15s ease",
        }}
      >
        {editing && (
          <IconButton
            onClick={onDelete}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "rgba(239,68,68,0.12)",
              border: "1.5px solid rgba(239,68,68,0.3)",
              borderRadius: 2,
              flexShrink: 0,
              "&:hover": { bgcolor: "rgba(239,68,68,0.22)" },
              "&:active": { transform: "scale(0.92)" },
            }}
          >
            <DeleteIcon sx={{ fontSize: "1rem", color: "#EF4444" }} />
          </IconButton>
        )}

        <Typography sx={{ fontSize: "2.25rem", lineHeight: 1, flexShrink: 0 }}>
          {product.emoji}
        </Typography>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}
          >
            {product.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mt: 0.25,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: stockColor(stock),
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              per {product.unit}
            </Typography>
            {changed && (
              <Typography
                sx={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 700 }}
              >
                · {delta > 0 ? `+${delta}` : delta} adjusted
              </Typography>
            )}
          </Box>
        </Box>

        {!editing && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            <IconButton
              onClick={onDecrement}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#1C1C1C",
                border: "1.5px solid #2A2A2A",
                borderRadius: 2,
                "&:hover": { bgcolor: "#2A2A2A" },
                "&:active": { transform: "scale(0.92)" },
              }}
            >
              <RemoveIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>

            <Box
              onClick={onEdit}
              sx={{
                minWidth: 56,
                textAlign: "center",
                cursor: "pointer",
                px: 1,
                py: 0.5,
                borderRadius: 2,
                "&:active": { opacity: 0.7 },
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: stockColor(stock),
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stock}
              </Typography>
            </Box>

            <IconButton
              onClick={onIncrement}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#1C1C1C",
                border: "1.5px solid #2A2A2A",
                borderRadius: 2,
                "&:hover": { bgcolor: "#2A2A2A" },
                "&:active": { transform: "scale(0.92)" },
              }}
            >
              <AddIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: "#1A1A1A", mx: 2 }} />
    </Box>
  );
}

export function AuditPage() {
  const { inventory, setStock } = useInventory();
  const { products, removeProduct } = useProducts();
  const [sessionStart] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      products.map((p) => [p.id, inventory[p.id] ?? p.initialStock]),
    ),
  );
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);

  const getStock = useCallback(
    (p: Product) => inventory[p.id] ?? p.initialStock,
    [inventory],
  );

  const handleEdit = useCallback(
    (product: Product) => {
      setEditTarget(product);
      setEditValue(String(inventory[product.id] ?? product.initialStock));
    },
    [inventory],
  );

  const confirmEdit = useCallback(() => {
    if (!editTarget) return;
    const n = parseInt(editValue, 10);
    if (!isNaN(n)) setStock(editTarget.id, n);
    setEditTarget(null);
  }, [editTarget, editValue, setStock]);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    removeProduct(deleteTarget.id);
    setDeleteTarget(null);
    if (products.length <= 1) setEditMode(false);
  }, [deleteTarget, removeProduct, products.length]);

  const changedCount = products.filter(
    (p) => getStock(p) !== (sessionStart[p.id] ?? p.initialStock),
  ).length;

  return (
    <Box sx={{ pb: 10 }}>
      <Box
        sx={{
          px: 2.5,
          pt: 3.5,
          pb: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{
              fontSize: "2rem",
              fontWeight: 900,
              color: "#F59E0B",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            AUDIT
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {changedCount > 0
              ? `${changedCount} item${changedCount !== 1 ? "s" : ""} adjusted this session`
              : "Tap a count to correct it"}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setEditMode((m) => !m)}
          sx={{
            color: editMode ? "#EF4444" : "#555",
            border: `1.5px solid ${editMode ? "rgba(239,68,68,0.35)" : "#2A2A2A"}`,
            borderRadius: 2,
            bgcolor: editMode ? "rgba(239,68,68,0.08)" : "transparent",
            "&:hover": {
              bgcolor: editMode
                ? "rgba(239,68,68,0.15)"
                : "rgba(255,255,255,0.04)",
            },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box>
        {products.map((product) => (
          <AuditRow
            key={product.id}
            product={product}
            stock={getStock(product)}
            original={sessionStart[product.id] ?? product.initialStock}
            editing={editMode}
            onIncrement={() => setStock(product.id, getStock(product) + 1)}
            onDecrement={() => setStock(product.id, getStock(product) - 1)}
            onEdit={() => handleEdit(product)}
            onDelete={() => setDeleteTarget(product)}
          />
        ))}
      </Box>

      <Dialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1C1C1C",
              borderRadius: 4,
              px: 1,
              pb: 1,
              width: "100%",
              maxWidth: 320,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.1rem", pb: 1 }}>
          {editTarget?.emoji} Set count
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            fullWidth
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmEdit();
            }}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                style: {
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  textAlign: "center",
                  padding: "12px 8px",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#555" },
                "&.Mui-focused fieldset": { borderColor: "#F59E0B" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, gap: 1 }}>
          <Button
            onClick={() => setEditTarget(null)}
            sx={{ color: "#666", fontWeight: 700, flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmEdit}
            sx={{
              bgcolor: "#F59E0B",
              color: "#000",
              fontWeight: 900,
              flex: 1,
              "&:hover": { bgcolor: "#D97706" },
            }}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1C1C1C",
              borderRadius: 4,
              px: 1,
              pb: 1,
              width: "100%",
              maxWidth: 320,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.1rem", pb: 1 }}>
          Remove {deleteTarget?.name}?
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ color: "text.secondary" }}>
            {deleteTarget?.emoji} {deleteTarget?.name} will be removed from all
            modes. This can't be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            sx={{ color: "#666", fontWeight: 700, flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              bgcolor: "#EF4444",
              color: "#fff",
              fontWeight: 900,
              flex: 1,
              "&:hover": { bgcolor: "#DC2626" },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
