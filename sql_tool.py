class MockSQLEngine:
    def query(self, query_str: str) -> str:
        return f"Mock SQL Result for: '{query_str}' -> Total quantity is 12000 and total paid is $1,200,000."

# Expose a dummy query engine so the workflow can be tested
query_engine = MockSQLEngine()
