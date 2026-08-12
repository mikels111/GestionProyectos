import React, { useState } from "react";
import styles from "./Stock.module.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
const products = [
    {
        id: 1,
        name: "Taladro Percutor",
        sku: "TLD-001",
        stock: 24,
        category: "Herramientas",
        img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 2,
        name: "Sierra Circular",
        sku: "SRC-014",
        stock: 8,
        category: "Herramientas",
        img: "https://images.unsplash.com/photo-1513467655676-561b7d489a88?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 3,
        name: "Casco de Seguridad",
        sku: "CSS-203",
        stock: 57,
        category: "Proteccion",
        img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 4,
        name: "Guantes Industriales",
        sku: "GNT-118",
        stock: 132,
        category: "Proteccion",
        img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 5,
        name: "Caja de Tornillos",
        sku: "CTR-320",
        stock: 91,
        category: "Ferreteria",
        img: "https://images.unsplash.com/photo-1581147036324-c1c7d3d384ec?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 6,
        name: "Compresor Portatil",
        sku: "CMP-022",
        stock: 5,
        category: "Maquinaria",
        img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80"
    }
];

function Stock() {
    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        stock: 0,
        category: ""
    });
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleCreateProduct = (e) => {
        e.preventDefault();
        console.log("Nuevo producto:", formData);
        const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
        //const publicBase = import.meta.env.BASE_URL ?? '/'
        axios({
            withCredentials: true,
            method: 'post',
            data: formData,
            url: `${publicBase}/api/Stock`,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (res) {
            if (res.status == 200) {
                //console.log("created project response", res.data.data);
            }
        }).catch(function (err) {
            console.log(err.data, "response")
        });

        setShowModal(false);
        setFormData({ name: "", sku: "", stock: 0, category: "" });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        //<div className={styles.contentWrapper}>
        <div>
            <section className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <div className={styles.headerFirst}>
                            <h1 className={styles.title}>Stock</h1>
                            <Button variant="primary" onClick={() => setShowModal(true)}>Nuevo</Button>
                        </div>

                        <p className={styles.subtitle}>
                            {filteredProducts.length} productos disponibles
                        </p>
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className={styles.searchInput}
                    />
                </div>

                {filteredProducts.length > 0 ? (
                    <div className={styles.grid}>
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                className={styles.card}
                                style={{ backgroundImage: `url(${product.img})` }}
                                aria-label={`Ver producto ${product.name}`}
                            >
                                <div className={styles.overlay}></div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.name}>{product.name}</h2>
                                    <p className={styles.stock}>Stock: {product.stock}</p>
                                    <p className={styles.sku}>{product.sku}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No hay productos que coincidan con la busqueda.</p>
                    </div>
                )}
            </section>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateProduct}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>SKU</Form.Label>
                            <Form.Control name="sku" value={formData.sku} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control name="category" value={formData.category} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>{' '}
                        <Button variant="primary" type="submit">Crear</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        //</div>
    );
}

export default Stock;
