document.addEventListener('DOMContentLoaded', () => {
    const claimButtons = document.querySelectorAll('.claimBusinessButton');
  
    claimButtons.forEach(claimBtn => {
      claimBtn.addEventListener('click', () => {
        const bizId = claimBtn.dataset.id;
        const bizIdInput = document.getElementById('claimBusinessId');
        if (bizIdInput) {
          bizIdInput.value = bizId;
        }
        document.getElementById('claimBusinessModal')?.classList.remove('hidden');
        document.getElementById('claimModalBackdrop')?.classList.remove('hidden');
      });
    });


    document.getElementById('closeClaimModalBtn').addEventListener('click', () => {
        document.getElementById('claimBusinessModal').classList.add('hidden');
        document.getElementById('claimModalBackdrop').classList.add('hidden');
    });
    
    document.getElementById('claimModalBackdrop').addEventListener('click', () => {
        document.getElementById('claimBusinessModal').classList.add('hidden');
        document.getElementById('claimModalBackdrop').classList.add('hidden');
    });
    
    const claimBusinessForm = document.getElementById('claimBusinessForm')
    if (claimBusinessForm) {
        claimBusinessForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const businessId = document.getElementById('claimBusinessId').value;
            const message = e.target.message.value.trim();
    
            try {
                const res = await fetch(`/api/businesses/${businessId}/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
    
            const data = await res.json();
            if (res.ok) {
                alert('Claim submitted!');
                e.target.reset();
                document.getElementById('claimBusinessModal').classList.add('hidden');
                document.getElementById('claimModalBackdrop').classList.add('hidden');
            } else {
                alert(data.error || 'Failed to claim business.');
            }
            } catch (err) {
            console.error(err);
            alert('Error submitting claim.');
            }
        });
    }
  });

