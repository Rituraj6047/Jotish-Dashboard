import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";
import { fetchEmployees } from "../utils/api";
import styles from "../styles/list.module.css";

export default function ListPage() {
  const { employees, setEmployees } = useEmployees();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await fetchEmployees();
        if (active) {
          setEmployees(data);
        }
      } catch (err) {
        if (active) {
          setErrorMsg(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => { active = false; };
  }, [setEmployees]);

  const ROW_HEIGHT = 56;
  const BUFFER = 5;
  const CONTAINER_HEIGHT = 600;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Virtualization math — keep this comment block in the code:
  // visibleStart: first row index to render = scrollTop/ROW_HEIGHT minus buffer
  // visibleEnd:   last row index  = (scrollTop+CONTAINER_HEIGHT)/ROW_HEIGHT + buffer
  // Each row: position absolute at top = absIndex * ROW_HEIGHT
  // Total inner height = employees.length * ROW_HEIGHT (gives scrollbar correct size)

  // NOTE: intentional bug — documented in README
  const visibleRows = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
    const end = Math.min(
      employees.length - 1,
      Math.floor((scrollTop + CONTAINER_HEIGHT) / ROW_HEIGHT) + BUFFER
    );
    return employees.slice(start, end + 1).map((emp, i) => ({
      ...emp, _absIndex: start + i
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTop]); // BUG: employees intentionally omitted from deps.
  // When fetch resolves + setEmployees fires, scrollTop unchanged so
  // memo skips recompute. List renders empty until user first scrolls.

  if (loading && employees.length === 0) {
    return <div>Loading...</div>;
  }

  if (errorMsg) {
    return <div className={styles.errorText}>Error: {errorMsg}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div 
        ref={containerRef}
        style={{ height: CONTAINER_HEIGHT, overflowY: "auto", position: "relative" }}
        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
        className={styles.container}
      >
        <div style={{ height: employees.length * ROW_HEIGHT, position: "relative" }}>
          {visibleRows.map((emp) => (
            <div 
              key={emp.id}
              style={{ position: "absolute", top: emp._absIndex * ROW_HEIGHT, height: ROW_HEIGHT, width: "100%" }}
              onClick={() => navigate(`/details/${emp.id}`, { state: emp })}
              className={styles.row}
            >
              {emp.id} | {emp.name} | {emp.city} | {emp.salary}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
